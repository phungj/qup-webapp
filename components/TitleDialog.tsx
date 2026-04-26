import {useRef, useEffect} from "react";
import TitleBold from "@/components/TitleBold";


export default function TitleDialog() {
    const titleDialogRef = useRef<HTMLDialogElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        titleDialogRef.current?.showModal();
        buttonRef.current?.focus();
    }, []);

    return (
        <dialog ref={titleDialogRef} className="m-auto modal">
            <div className="modal-box">
                <TitleBold/>
                <h2 className="mb-3">Sick of long queues, unfair matchups, and arbitrary reflex tests?  Try <a href="https://store.steampowered.com/app/3730790/QUP/" className="link link-warning">Q-UP</a>, the coin flipping eSport.  Every single round of Q-UP is determined by the result of a coin flip, so every single round of Q-UP is completely fair.</h2>
                <h2 className="mb-4">No more smurfs ruining your games. No more inters. No more tryhards. No more stupid reaction times or mechanics.  Just perfectly fair matches, every single time.</h2>
                <form method="dialog">
                    <button ref={buttonRef} className="block mx-auto btn btn-primary">I'm Ready</button>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button/>
            </form>
        </dialog>);
}