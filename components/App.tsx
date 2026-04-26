"use client";

import {useEffect, useState} from "react";
import {Player} from "@/src/player";
import Stats from "@/components/Stats";
import {MatchState, runMatch} from "@/src/game";
import Results from "@/components/Results";
import TitleItalics from "@/components/TitleItalics";
import Navbar from "@/components/Navbar";
import {
    buildSkillGrid,
    ParsedSkillInstance,
    parseSkillGrid,
    PersistedPlayer, serializePlayer,
    SkillParseError
} from "@/src/parser";
import ErrorDialog from "@/components/ErrorDialog";
import ImportDialog from "@/components/ImportDialog";
import TitleDialog from "@/components/TitleDialog";
import Help from "@/components/Help";

type MatchExecutionState =
    | {state: "none"}
    | {state: "done", result: MatchState}

type ViewState = "menu" | "results" | "help";

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

                    <div className="flex-1 flex items-center justify-center">
                        {getMainContent()}
                    </div>
                </div>
            </div>
        );
    }

    function playMatch() {
        const { player: nextPlayer, result } = applyMatch(player);

        setPlayer(nextPlayer);
        setMatchState({ state: "done", result: result });
        setView("results");
    }

    function applyMatch(player: Player): {
        player: Player;
        result: MatchState;
    } {
        const result = runMatch(player);

        return {
            result,
            player: {
                ...player,
                q: Math.max(0, player.q + result.qDelta)
            }
        };
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

    function getMainContent() {
        switch (view) {
            case "menu":
                return (
                    <div className="flex flex-col items-center gap-4">
                        <TitleItalics/>
                        <Stats player={player}/>
                        <div className="flex gap-5 max-w-screen">
                            <button onClick={playMatch} className="btn btn-primary flex-1">
                                Play
                            </button>
                            <button onClick={() => setImporting(true)} className="btn btn-secondary flex-1 leading-tight">
                                Load Skills
                            </button>
                        </div>
                    </div>
                );
            case "results":
                return matchState.state === "done" ? <Results matchState={matchState.result} player={player} playMatch={playMatch} resetMenu={resetMenu}/> : null;
            case "help":
                return <Help/>;
        }
    }
}

// TODO: Then deploy!