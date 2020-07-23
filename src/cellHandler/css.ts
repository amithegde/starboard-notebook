import { html, render, TemplateResult } from "lit-html";
import { Cell } from "../notebookContent";
import { CellHandler, CellHandlerAttachParameters, CellElements } from "./base";
import { getDefaultControlsTemplate, ControlButton } from "../components/controls";
import { createMonacoEditor } from "../editor/monaco";
import { CellEvent } from "../components/cell";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
import { PlayCircleIcon } from "@spectrum-web-components/icons-workflow";


export const CSS_CELL_TYPE_DEFINITION = {
    name: "CSS",
    cellType: "css",
    createHandler: (c: Cell) => new CSSCellHandler(c),
    icon: "fab fa-css3-alt"
};



export class CSSCellHandler extends CellHandler {

    private elements!: CellElements;
    private editor: any;
    private emit!: (event: CellEvent) => void;

    constructor(cell: Cell) {
        super(cell);
    }

    private getControls(): TemplateResult {
        const icon = PlayCircleIcon;
        const tooltip = "Run Cell";
        const runButton: ControlButton = {
            icon,
            tooltip,
            callback: () => this.emit({ type: "RUN_CELL" }),
        };
        return getDefaultControlsTemplate({ buttons: [runButton] });
    }

    attach(params: CellHandlerAttachParameters) {
        this.elements = params.elements;
        this.emit = params.emit;

        const topElement = this.elements.topElement;
        topElement.classList.add("cell-editor");

        render(this.getControls(), this.elements.topControlsElement);
        this.editor = createMonacoEditor(topElement, this.cell, { language: "css" }, this.emit);
    }

    async run() {
        const content = this.cell.textContent;
        console.log("CSS content", content);
        render(html`${unsafeHTML("<style>" + content + "</style>")}`, this.elements.bottomElement);
    }

    focusEditor() {
        if (this.editor) {
            this.editor.focus();
        }
    }

    async dispose() {
        if (this.editor) {
            this.editor.dispose();
        }
    }
}