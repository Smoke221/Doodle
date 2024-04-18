import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import ShapesMenu from "./shapesMenu";


const Private: React.FC = () => {
    const { editor, onReady } = useFabricJSEditor();
    const [history, setHistory] = useState<any[]>([]);
    const [color, setColor] = useState<string>("#35363a");
    const [brushSize, setBrushSize] = useState<number>(3);
    const [selectedShape, setSelectedShape] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>("");

    useEffect(() => {
        if (!editor || !editor.canvas || !fabric) {
            return;
        }
        editor.canvas.freeDrawingBrush.width = brushSize;
        editor.canvas.setHeight(500);
        editor.canvas.setWidth(965);
        editor.canvas.renderAll();
    }, [editor, brushSize]);

    useEffect(() => {
        if (!editor || !fabric) {
            return;
        }
        editor.canvas.freeDrawingBrush.color = color;
        editor.setStrokeColor(color);
    }, [color]);

    const handleBrushSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(e.target.value);
        setBrushSize(newSize);
    };

    const toggleDraw = () => {
        editor.canvas.isDrawingMode = !editor.canvas.isDrawingMode;
    };

    const undo = () => {
        if (editor.canvas._objects.length > 0) {
            setHistory([...history, editor.canvas._objects.pop()]);
            editor.canvas.renderAll();
        }
    };

    const redo = () => {
        if (history.length > 0) {
            editor.canvas.add(history.pop());
        }
    };

    const clear = () => {
        setHistory([]);
        editor.canvas.clear();
    };

    const removeSelectedObject = () => {
        editor.canvas.remove(editor.canvas.getActiveObject());
    };

    const addText = () => {
        editor.addText("Add text");
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
                case "ellipse":
                    shape = new fabric.Ellipse({ rx: 50, ry: 30, fill: "transparent", stroke: 1 });
                    break;
                case "line":
                    shape = new fabric.Line([50, 100, 200, 100], { fill: 'transparent', stroke: 1 });
                    break;
                case "polygon":
                    shape = new fabric.Polygon([{ x: 100, y: 0 }, { x: 200, y: 50 }, { x: 100, y: 100 }, { x: 0, y: 50 }], { fill: 'transparent', stroke: 1 });
                    break;
                default:
                    break;
            }
            if (shape) {
                editor.canvas.add(shape);
            }
        }
    }, [editor, selectedShape]);

    const colorOptions = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#800000", "#008000", "#000080"];

    const colorButtons = colorOptions.map((option, index) => (
        <button
            key={index}
            className="btn"
            style={{ backgroundColor: option, width: "30px", height: "30px", margin: "2px", border: "1px solid gray", }}
            onClick={() => {
                setSelectedColor(option);
                setColor(option);
            }}
        />
    ));

    // to download as an image.
    const exportWhiteboard = () => {
        if (!editor) {
            return;
        }
        const dataURL = editor.canvas.toDataURL();

        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'whiteboard.png';

        link.click();
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Doodl</h1>
            <div className="row">
                <div className="col-3">
                    <ShapesMenu onSelectShape={setSelectedShape} />
                    <button className="btn btn-light m-2" onClick={addText}><i className="bi bi-alphabet-uppercase"></i></button>
                    <button className="btn btn-light m-2" onClick={toggleDraw}><i className="bi bi-pencil"></i></button>
                    <button className="btn btn-light" onClick={fillSelectedShape}><i className="bi bi-paint-bucket"></i></button>
                    <div className="d-flex flex-row">
                        <button className="btn btn-secondary d-flex flex-column align-items-center m-2" onClick={undo}>
                            <i className="bi bi-arrow-counterclockwise"></i>
                            <span style={{ fontSize: '0.6rem' }}>Undo</span>
                        </button>
                        <button className="btn btn-secondary d-flex flex-column align-items-center m-2" onClick={redo}>
                            <i className="bi bi-arrow-clockwise"></i>
                            <span style={{ fontSize: '0.6rem' }}>Redo</span>
                        </button>
                        <button className="btn btn-warning d-flex flex-column align-items-center m-2" onClick={clear}>
                            <i className="bi bi-x"></i>
                            <span style={{ fontSize: '0.6rem' }}>Clear</span>
                        </button>
                    </div>
                    <button className="btn btn-danger m-2" onClick={removeSelectedObject}><i className="bi bi-trash3"></i></button>
                    <div className="mb-2">
                        <div className="d-flex flex-wrap align-items-center">
                            {colorButtons}
                        </div>
                    </div>
                    <label className="d-block mb-2">
                        Brush Size: {brushSize}
                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={brushSize}
                            onChange={handleBrushSizeChange}
                            className="form-range"
                        />
                    </label>
                    <label className="d-block">
                        <span>Color:</span>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => {
                                setColor(e.target.value);
                                setSelectedColor(e.target.value);
                            }}
                            className="form-control"
                        />
                    </label>
                    <button className="btn btn-success d-flex flex-column align-items-center m-2  bi bi-arrow-down-circle" onClick={exportWhiteboard}><span style={{ fontSize: '0.6rem' }}>Download</span></button>
                </div>
                <div className="col-9">
                    <FabricJSCanvas className="border border-dark" onReady={onReady} />
                </div>
            </div>
        </div>
    );
}

export default Private;
