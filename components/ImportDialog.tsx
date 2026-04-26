import {useEffect, useRef} from "react";
import {skillJSON} from "@/src/skillJSON";

type ErrorDialogProps = {
    importing: boolean,
    handleImport: (json: string) => void,
    resetImporting: () => void
}

export default function ImportDialog({importing, handleImport, resetImporting}: ErrorDialogProps) {
    const importDialogRef = useRef<HTMLDialogElement>(null);
    const importTextareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (importing) {
            if (importTextareaRef.current) {
                importTextareaRef.current.value = "";
            }

            importDialogRef.current?.showModal();
        } else {
            importDialogRef.current?.close();
        }
    }, [importing]);

    return  (
        <dialog ref={importDialogRef} className="text-center m-auto modal">
            <div className="modal-box">
                <h1 className="font-title text-heading text-2xl font-bold mb-4">Import Skills</h1>
                <textarea ref={importTextareaRef} className="textarea h-64 mb-4" placeholder={skillJSON}></textarea>
                <button onClick={() => handleImport(importTextareaRef.current?.value ?? "")} className="block mx-auto btn btn-primary">Ok</button>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={resetImporting}/>
            </form>
        </dialog>
    )
}