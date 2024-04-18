import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import ShapesMenu from "./shapesMenu";

const Private: React.FC = () => {
    const { editor, onReady } = useFabricJSEditor();

    const history: [] = []

    const [color, setColor] = useState<string>("#35363a");
    const [brushSize, setBrushSize] = useState<number>(3);
    const [selectedShape, setSelectedShape] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>("");

    useEffect(() => {
        if (!editor || !editor.canvas || !fabric) {
            return;
        }
        // Set the brush width when brushSize changes
        editor.canvas.freeDrawingBrush.width = brushSize;

        editor.canvas.setHeight(500);
        editor.canvas.setWidth(500);
        editor.canvas.renderAll();
    }, [editor, brushSize]);

    const handleBrushSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(e.target.value);
        setBrushSize(newSize);
    };

    useEffect(() => {
        if (!editor || !fabric) {
            return;
        }
        editor.canvas.freeDrawingBrush.color = color;
        editor.setStrokeColor(color);
    }, [color]);

    const toggleDraw = () => {
        editor.canvas.isDrawingMode = !editor.canvas.isDrawingMode;
    };
    const undo = () => {
        if (editor.canvas._objects.length > 0) {
            history.push(editor.canvas._objects.pop());
        }
        editor.canvas.renderAll();
    };
    const redo = () => {
        if (history.length > 0) {
            editor.canvas.add(history.pop());
        }
    };

    const clear = () => {
        editor.canvas._objects.splice(0, editor.canvas._objects.length);
        history.splice(0, history.length);
        editor.canvas.renderAll();
    };

    const removeSelectedObject = () => {
        editor.canvas.remove(editor.canvas.getActiveObject());
    };

    const addText = () => {
        editor.addText("inset text");
    };

    const fillSelectedShape = () => {
        const activeObject = editor.canvas.getActiveObject();
        if (activeObject) {
            activeObject.set("fill", selectedColor);
            editor.canvas.renderAll();
        }
    };

    useEffect(() => {
        if (editor && selectedShape) {
            let shape;
            switch (selectedShape) {
                case "circle":
                    shape = new fabric.Circle({ radius: 50, fill: "transparent", stroke: 1 });
                    break;
                case "rectangle":
                    shape = new fabric.Rect({ width: 100, height: 50, fill: "transparent", stroke: 1 });
                    break;
                case "triangle":
                    shape = new fabric.Triangle({ width: 100, height: 100, fill: "transparent", stroke: 1 });
                    break;
                default:
                    break;
            }
            if (shape) {
                editor.canvas.add(shape);
            }
        }
    }, [editor, selectedShape]);

    return <div className="App">
        <div>
            <h1>Doodl</h1>
            <ShapesMenu onSelectShape={setSelectedShape} />
            <button onClick={addText}>Add Text</button>
            <button onClick={toggleDraw}>Toggle draw</button>
            <button onClick={clear}>Clear</button>
            <button onClick={undo}>Undo</button>
            <button onClick={redo}>Redo</button>
            <button onClick={fillSelectedShape}>Fill</button>
            <label>
                Brush Size:
                <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={handleBrushSizeChange}
                />
                {brushSize}
            </label>
            <button onClick={removeSelectedObject}>Delete</button>
            <label>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => {
                        setColor(e.target.value)
                        setSelectedColor(e.target.value)
                    }}
                />
            </label>

            <div>
                <FabricJSCanvas className="sample-canvas" onReady={onReady} />
            </div>
        </div>
    </div>
}

export default Private;
