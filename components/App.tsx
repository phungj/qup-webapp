"use client";

import {useEffect, useState} from "react";
import {Player} from "@/src/player";
import Stats from "@/components/Stats";
import {MatchPlayback, MatchState, runMatch} from "@/src/game";
import Results from "@/components/Results";
import TitleItalics from "@/components/TitleItalics";
import Navbar from "@/components/Navbar";
import {
    buildSkillGrid,
    parseSkillGrid,
    PersistedPlayer, serializePlayer,
    SkillParseError
} from "@/src/parser";
import ErrorDialog from "@/components/ErrorDialog";
import ImportDialog from "@/components/ImportDialog";
import TitleDialog from "@/components/TitleDialog";
import Help from "@/components/Help";
import {placeSkill, removeSkill} from "@/src/skills";
import Skills from "@/components/Skills";
import Match from "@/components/Match";

type MatchExecutionState =
    | {state: "none"}
    | {state: "done", result: MatchState}

type ViewState = "menu" | "results" | "help" | "skills" | "match";

// TODO: Eliminate casts and assertions
// TODO: Add a tracker for max Q
export default function App() {
    const [player, setPlayer] = useState<Player>({
        hero: "",
        level: 0,
        money: 0,
        q: 0,
        rank: 0,
        xp: 0,
        grid: new Map()
    });

    const [mounted, setMounted] = useState<boolean>(false);

    const [matchState, setMatchState] = useState<MatchExecutionState>({
        state: "none"
    });

    const [errored, setErrored] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [importing, setImporting] = useState<boolean>(false);

    const [playback, setPlayback] = useState<MatchPlayback | null>(null);

    const [view, setView] = useState<ViewState>("menu");

    useEffect(() => {
        setMounted(true);
    }, []);

    // TODO: Add additional validation to this to prevent save editing
    // TODO: Possibly use isSkillJSON for validation here
    useEffect(() => {
        const rawSave = localStorage.getItem("q-up");
        if (rawSave) {
            const data = JSON.parse(rawSave);

            setPlayer({
                ...data,
                grid: buildSkillGrid(data.grid)
            });
        }
    }, []);

    useEffect(() => {
        const save: PersistedPlayer = serializePlayer(player);
        localStorage.setItem("q-up", JSON.stringify(save));
    }, [player]);

    if (!mounted) {
        return null;
    } else {
        return (
            <div>
                <TitleDialog/>
                <ErrorDialog errored={errored} message={errorMessage} resetError={resetError}/>
                <ImportDialog importing={importing} handleImport={loadSkills} resetImporting={resetImporting}/>
                <div className="h-screen flex flex-col">
                    <Navbar homeButtonHandler={resetMenu} helpButtonHandler={setHelpView}/>

                    <div className="flex-1">
                        {getMainContent()}
                    </div>
                </div>
            </div>
        );
    }

    function playMatch() {
        const playback = runMatch(player);

        setPlayer(prev => ({
            ...prev,
            q: Math.max(0, prev.q + playback.final.qDelta)
        }));

        setMatchState({ state: "done", result: playback.final });
        setView("match");
        setPlayback(playback);
    }

    function resetMenu() {
        setMatchState({
            state: "none"
        });
        setView("menu");
    }

    function resetError() {
        setErrored(false);
        setErrorMessage("");
    }
    
    function resetImporting() {
        setImporting(false);
    }

    function setHelpView() {
        setView("help");
    }

    function setSkillsView() {
        setView("skills");
    }

    function setResultsView() {
        setView("results");
    }

    function loadSkills(json: string) {
        if (!json.trim()) {
            setErrored(true);
            setErrorMessage("empty skill data");
            return;
        }

        try {
            const grid = parseSkillGrid(json);

            setPlayer(prev => ({
                ...prev,
                grid
            }));

            resetImporting();
        } catch (err) {
            if (err instanceof SkillParseError || err instanceof SyntaxError) {
                setErrored(true);
                setErrorMessage(err.message);
            }
        }
    }

    function handleDropSkill(skillID: string, q: number, r: number) {
        setPlayer(prev => ({
           ...prev,
           grid: placeSkill(prev.grid, skillID, q, r)
        }));
    }

    function handleRemoveSkill(q: number, r: number) {
        setPlayer(prev => ({
            ...prev,
            grid: removeSkill(prev.grid, q, r)
        }));
    }

    function getMainContent() {
        switch (view) {
            case "menu":
                return (
                    <div className="h-full flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <TitleItalics/>
                            <Stats player={player}/>
                            <div className="grid grid-cols-2 gap-5 w-full max-w-md">
                                <button onClick={playMatch} className="btn btn-primary">
                                    Play
                                </button>
                                <button onClick={setSkillsView} className="btn btn-secondary">
                                    Skills
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case "results":
                return matchState.state === "done" ? <Results matchState={matchState.result} player={player} playMatch={playMatch} resetMenu={resetMenu}/> : null;
            case "help":
                return <Help/>;
            case "skills":
                return (
                    <div className="ml-20">
                        <Skills grid={player.grid} onDropSkill={handleDropSkill} onRemoveSkill={handleRemoveSkill}/>
                    </div>
                );
            case "match":
                return <Match playback={playback!} showResults={setResultsView}></Match>
        }
    }
}