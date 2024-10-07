 
const customTemplates = [
    {
        name: "Dark Neon",
        blocks: {
            class: {
                backgroundColor: "#2D3748",
                borderColor: "#00FF00",
                textColor: "#00FFFF",
                headerColor: "#1A202C"
            },
            class_function: {
                backgroundColor: "#1A202C",
                borderColor: "#FF00FF",
                textColor: "#FFFFFF",
                headerColor: "#2D3748"
            },
            code: {
                backgroundColor: "#4A5568",
                borderColor: "#FFA500",
                textColor: "#F7FAFC",
                headerColor: "#2D3748"
            },
            class_standalone: {
                backgroundColor: "#2D3748",
                borderColor: "#00FFFF",
                textColor: "#FFFFFF",
                headerColor: "#1A202C"
            },
            standalone_function: {
                backgroundColor: "#4A5568",
                borderColor: "#FF69B4",
                textColor: "#F7FAFC",
                headerColor: "#2D3748"
            }
        },
        connections: {
            uses: {
                lineColor: "#00FF00",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            class_contains_functions: {
                lineColor: "#FF00FF",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            class_to_standalone: {
                lineColor: "#FFA500",
                arrowHead: "circle",
                lineStyle: "dotted"
            },
            inherits: {
                lineColor: "#00FFFF",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            composes: {
                lineColor: "#FF69B4",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            codeLink: {
                lineColor: "#FFD700",
                arrowHead: "arrow",
                lineStyle: "solid"
            }
        },
        canvas: {
            backgroundColor: "#1A202C",
            gridColor: "#4A5568",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#2D3748",
            textColor: "#F7FAFC",
            lineNumbersColor: "#A0AEC0",
            highlightColor: "#4299E1"
        }
    },
    {
        name: "Syntax Highlighter",
        blocks: {
            class: {
                backgroundColor: "#282C34",
                borderColor: "#61AFEF",
                textColor: "#ABB2BF",
                headerColor: "#21252B"
            },
            class_function: {
                backgroundColor: "#2C313A",
                borderColor: "#C678DD",
                textColor: "#ABB2BF",
                headerColor: "#21252B"
            },
            code: {
                backgroundColor: "#21252B",
                borderColor: "#98C379",
                textColor: "#ABB2BF",
                headerColor: "#282C34"
            },
            class_standalone: {
                backgroundColor: "#282C34",
                borderColor: "#E5C07B",
                textColor: "#ABB2BF",
                headerColor: "#21252B"
            },
            standalone_function: {
                backgroundColor: "#2C313A",
                borderColor: "#56B6C2",
                textColor: "#ABB2BF",
                headerColor: "#21252B"
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
            },
            inherits: {
                lineColor: "#98C379",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            composes: {
                lineColor: "#C678DD",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            codeLink: {
                lineColor: "#61AFEF",
                arrowHead: "arrow",
                lineStyle: "solid"
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
                textColor: "#1A237E",
                headerColor: "#E8EAF6"
            },
            class_function: {
                backgroundColor: "#E8EAF6",
                borderColor: "#3F51B5",
                textColor: "#283593",
                headerColor: "#C5CAE9"
            },
            code: {
                backgroundColor: "#C5CAE9",
                borderColor: "#7986CB",
                textColor: "#1A237E",
                headerColor: "#E8EAF6"
            },
            class_standalone: {
                backgroundColor: "#E8EAF6",
                borderColor: "#3F51B5",
                textColor: "#1A237E",
                headerColor: "#C5CAE9"
            },
            standalone_function: {
                backgroundColor: "#C5CAE9",
                borderColor: "#7986CB",
                textColor: "#283593",
                headerColor: "#E8EAF6"
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
            },
            inherits: {
                lineColor: "#9C27B0",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            composes: {
                lineColor: "#4CAF50",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            codeLink: {
                lineColor: "#FF5722",
                arrowHead: "arrow",
                lineStyle: "solid"
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
                textColor: "#00363A",
                headerColor: "#B2EBF2"
            },
            class_function: {
                backgroundColor: "#B2EBF2",
                borderColor: "#0097A7",
                textColor: "#00363A",
                headerColor: "#80DEEA"
            },
            code: {
                backgroundColor: "#80DEEA",
                borderColor: "#00BCD4",
                textColor: "#006064",
                headerColor: "#B2EBF2"
            },
            class_standalone: {
                backgroundColor: "#E0F7FA",
                borderColor: "#00838F",
                textColor: "#00363A",
                headerColor: "#B2EBF2"
            },
            standalone_function: {
                backgroundColor: "#B2EBF2",
                borderColor: "#0097A7",
                textColor: "#00363A",
                headerColor: "#80DEEA"
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
            },
            inherits: {
                lineColor: "#00E676",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            composes: {
                lineColor: "#FF4081",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            codeLink: {
                lineColor: "#40C4FF",
                arrowHead: "arrow",
                lineStyle: "solid"
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
                textColor: "#1B5E20",
                headerColor: "#C8E6C9"
            },
            class_function: {
                backgroundColor: "#C8E6C9",
                borderColor: "#43A047",
                textColor: "#1B5E20",
                headerColor: "#A5D6A7"
            },
            code: {
                backgroundColor: "#A5D6A7",
                borderColor: "#66BB6A",
                textColor: "#1B5E20",
                headerColor: "#C8E6C9"
            },
            class_standalone: {
                backgroundColor: "#E8F5E9",
                borderColor: "#388E3C",
                textColor: "#1B5E20",
                headerColor: "#C8E6C9"
            },
            standalone_function: {
                backgroundColor: "#C8E6C9",
                borderColor: "#43A047",
                textColor: "#1B5E20",
                headerColor: "#A5D6A7"
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
            },
            inherits: {
                lineColor: "#9C27B0",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            composes: {
                lineColor: "#FF9800",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            codeLink: {
                lineColor: "#2196F3",
                arrowHead: "arrow",
                lineStyle: "solid"
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
                textColor: "#B2CCD6",
                headerColor: "#37474F"
            },
            class_function: {
                backgroundColor: "#37474F",
                borderColor: "#80CBC4",
                textColor: "#B2CCD6",
                headerColor: "#455A64"
            },
            code: {
                backgroundColor: "#455A64",
                borderColor: "#80CBC4",
                textColor: "#B2CCD6",
                headerColor: "#37474F"
            },
            class_standalone: {
                backgroundColor: "#263238",
                borderColor: "#80CBC4",
                textColor: "#B2CCD6",
                headerColor: "#37474F"
            },
            standalone_function: {
                backgroundColor: "#37474F",
                borderColor: "#80CBC4",
                textColor: "#B2CCD6",
                headerColor: "#455A64"
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
            },
            inherits: {
                lineColor: "#82AAFF",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            composes: {
                lineColor: "#FF5370",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            codeLink: {
                lineColor: "#89DDFF",
                arrowHead: "arrow",
                lineStyle: "solid"
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