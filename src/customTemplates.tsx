const customTemplates = [
    // ... (existing templates)

    {
        name: "Syntax Highlighter",
        blocks: {
            class: {
                backgroundColor: "#282C34",
                borderColor: "#61AFEF",
                textColor: "#ABB2BF"
            },
            class_function: {
                backgroundColor: "#2C313A",
                borderColor: "#C678DD",
                textColor: "#ABB2BF"
            },
            code: {
                backgroundColor: "#21252B",
                borderColor: "#98C379",
                textColor: "#ABB2BF"
            }
        },
        connections: {
            uses: {
                lineColor: "#E06C75",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            class_contains_functions: {
                lineColor: "#56B6C2",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            class_to_standalone: {
                lineColor: "#D19A66",
                arrowHead: "circle",
                lineStyle: "dotted"
            }
        },
        canvas: {
            backgroundColor: "#282C34",
            gridColor: "#3E4451",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#282C34",
            textColor: "#ABB2BF",
            lineNumbersColor: "#4B5263",
            highlightColor: "#3E4451"
        }
    },
    {
        name: "Functional Flow",
        blocks: {
            class: {
                backgroundColor: "#FAFAFA",
                borderColor: "#0D47A1",
                textColor: "#1A237E"
            },
            class_function: {
                backgroundColor: "#E8EAF6",
                borderColor: "#3F51B5",
                textColor: "#283593"
            },
            code: {
                backgroundColor: "#C5CAE9",
                borderColor: "#7986CB",
                textColor: "#1A237E"
            }
        },
        connections: {
            uses: {
                lineColor: "#FF4081",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            class_contains_functions: {
                lineColor: "#00BCD4",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            class_to_standalone: {
                lineColor: "#FFC107",
                arrowHead: "circle",
                lineStyle: "dotted"
            }
        },
        canvas: {
            backgroundColor: "#E8EAF6",
            gridColor: "#C5CAE9",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#FAFAFA",
            textColor: "#1A237E",
            lineNumbersColor: "#7986CB",
            highlightColor: "#3F51B5"
        }
    },
    {
        name: "Data Flow",
        blocks: {
            class: {
                backgroundColor: "#E0F7FA",
                borderColor: "#006064",
                textColor: "#00363A"
            },
            class_function: {
                backgroundColor: "#B2EBF2",
                borderColor: "#0097A7",
                textColor: "#00363A"
            },
            code: {
                backgroundColor: "#80DEEA",
                borderColor: "#00BCD4",
                textColor: "#006064"
            }
        },
        connections: {
            uses: {
                lineColor: "#FF6E40",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            class_contains_functions: {
                lineColor: "#651FFF",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            class_to_standalone: {
                lineColor: "#FFD740",
                arrowHead: "circle",
                lineStyle: "dotted"
            }
        },
        canvas: {
            backgroundColor: "#E0F7FA",
            gridColor: "#B2EBF2",
            gridSpacing: 25
        },
        ide: {
            backgroundColor: "#FFFFFF",
            textColor: "#00363A",
            lineNumbersColor: "#26C6DA",
            highlightColor: "#00BCD4"
        }
    },
    {
        name: "Object-Oriented Focus",
        blocks: {
            class: {
                backgroundColor: "#E8F5E9",
                borderColor: "#2E7D32",
                textColor: "#1B5E20"
            },
            class_function: {
                backgroundColor: "#C8E6C9",
                borderColor: "#43A047",
                textColor: "#1B5E20"
            },
            code: {
                backgroundColor: "#A5D6A7",
                borderColor: "#66BB6A",
                textColor: "#1B5E20"
            }
        },
        connections: {
            uses: {
                lineColor: "#F44336",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            class_contains_functions: {
                lineColor: "#3F51B5",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            class_to_standalone: {
                lineColor: "#FFC107",
                arrowHead: "circle",
                lineStyle: "dotted"
            }
        },
        canvas: {
            backgroundColor: "#E8F5E9",
            gridColor: "#C8E6C9",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#FFFFFF",
            textColor: "#1B5E20",
            lineNumbersColor: "#66BB6A",
            highlightColor: "#4CAF50"
        }
    },
    {
        name: "Midnight Coder",
        blocks: {
            class: {
                backgroundColor: "#263238",
                borderColor: "#80CBC4",
                textColor: "#B2CCD6"
            },
            class_function: {
                backgroundColor: "#37474F",
                borderColor: "#80CBC4",
                textColor: "#B2CCD6"
            },
            code: {
                backgroundColor: "#455A64",
                borderColor: "#80CBC4",
                textColor: "#B2CCD6"
            }
        },
        connections: {
            uses: {
                lineColor: "#F07178",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            class_contains_functions: {
                lineColor: "#C792EA",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            class_to_standalone: {
                lineColor: "#FFCB6B",
                arrowHead: "circle",
                lineStyle: "dotted"
            }
        },
        canvas: {
            backgroundColor: "#263238",
            gridColor: "#37474F",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#263238",
            textColor: "#B2CCD6",
            lineNumbersColor: "#546E7A",
            highlightColor: "#80CBC4"
        }
    }
];

export default customTemplates;