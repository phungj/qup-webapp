import {useEffect, useRef} from "react";

type ErrorDialogProps = {
    errored: boolean,
    message: string,
    resetError: () => void
}

export default function ErrorDialog({errored, message, resetError}: ErrorDialogProps) {
    const errorDialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (errored) {
            errorDialogRef.current?.showModal();
        }
    }, [errored]);

    return  (
        <dialog ref={errorDialogRef} className="text-center m-auto modal">
            <div className="modal-box">
                <h1 className="font-title text-heading text-2xl font-bold mb-1">Error</h1>
                <h2 className="mb-3">An error occurred when parsing skill JSON: {message}</h2>
                <form method="dialog">
                    <button onClick={resetError} className="block mx-auto btn btn-primary">Ok</button>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={resetError}/>
            </form>
        </dialog>
    )
}