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
            idecontainsclass: {
                lineColor: "#00FF00",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            class_contains_functions: {
                lineColor: "#FF00FF",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            class_contains_standalone: {
                lineColor: "#00FFFF",
                arrowHead: "diamond",
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
            idecontainsstandalonecode: {
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
            idecontainsclass: {
                lineColor: "#E06C75",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            class_contains_functions: {
                lineColor: "#56B6C2",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            class_contains_standalone: {
                lineColor: "#E5C07B",
                arrowHead: "diamond",
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
            idecontainsstandalonecode: {
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
            idecontainsclass: {
                lineColor: "#FF4081",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            class_contains_functions: {
                lineColor: "#00BCD4",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            class_contains_standalone: {
                lineColor: "#3F51B5",
                arrowHead: "diamond",
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
            idecontainsstandalonecode: {
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
            idecontainsclass: {
                lineColor: "#FF6E40",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            class_contains_functions: {
                lineColor: "#651FFF",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            class_contains_standalone: {
                lineColor: "#00BCD4",
                arrowHead: "diamond",
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
            idecontainsstandalonecode: {
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
            idecontainsclass: {
                lineColor: "#F44336",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            class_contains_functions: {
                lineColor: "#3F51B5",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            class_contains_standalone: {
                lineColor: "#4CAF50",
                arrowHead: "diamond",
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
            idecontainsstandalonecode: {
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
            idecontainsclass: {
                lineColor: "#F07178",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            class_contains_functions: {
                lineColor: "#C792EA",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            class_contains_standalone: {
                lineColor: "#89DDFF",
                arrowHead: "diamond",
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
            idecontainsstandalonecode: {
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
    },
    {
        name: "Matrix Code",
        blocks: {
            class: {
                backgroundColor: "#000000",
                borderColor: "#00FF00",
                textColor: "#00FF00",
                headerColor: "#001100"
            },
            class_function: {
                backgroundColor: "#001100",
                borderColor: "#00FF00",
                textColor: "#00FF00",
                headerColor: "#002200"
            },
            code: {
                backgroundColor: "#002200",
                borderColor: "#00FF00",
                textColor: "#00FF00",
                headerColor: "#001100"
            },
            class_standalone: {
                backgroundColor: "#000000",
                borderColor: "#00FF00",
                textColor: "#00FF00",
                headerColor: "#001100"
            },
            standalone_function: {
                backgroundColor: "#001100",
                borderColor: "#00FF00",
                textColor: "#00FF00",
                headerColor: "#002200"
            }
        },
        connections: {
            idecontainsclass: {
                lineColor: "#00FF00",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            class_contains_functions: {
                lineColor: "#33FF33",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            class_contains_standalone: {
                lineColor: "#66FF66",
                arrowHead: "diamond",
                lineStyle: "dotted"
            },
            inherits: {
                lineColor: "#00CC00",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            composes: {
                lineColor: "#00AA00",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            idecontainsstandalonecode: {
                lineColor: "#009900",
                arrowHead: "arrow",
                lineStyle: "solid"
            }
        },
        canvas: {
            backgroundColor: "#000000",
            gridColor: "#003300",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#000000",
            textColor: "#00FF00",
            lineNumbersColor: "#006600",
            highlightColor: "#00AA00"
        }
    },
    {
        name: "Cyberpunk Night City",
        blocks: {
            class: {
                backgroundColor: "#0D0221",
                borderColor: "#FF00FF",
                textColor: "#00FFFF",
                headerColor: "#190535"
            },
            class_function: {
                backgroundColor: "#190535",
                borderColor: "#FF00FF",
                textColor: "#00FFFF",
                headerColor: "#2B0A50"
            },
            code: {
                backgroundColor: "#2B0A50",
                borderColor: "#FF00FF",
                textColor: "#00FFFF",
                headerColor: "#190535"
            },
            class_standalone: {
                backgroundColor: "#0D0221",
                borderColor: "#FF00FF",
                textColor: "#00FFFF",
                headerColor: "#190535"
            },
            standalone_function: {
                backgroundColor: "#190535",
                borderColor: "#FF00FF",
                textColor: "#00FFFF",
                headerColor: "#2B0A50"
            }
        },
        connections: {
            idecontainsclass: {
                lineColor: "#FF00FF",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            class_contains_functions: {
                lineColor: "#00FFFF",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            class_contains_standalone: {
                lineColor: "#FF00AA",
                arrowHead: "diamond",
                lineStyle: "dotted"
            },
            inherits: {
                lineColor: "#FF1493",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            composes: {
                lineColor: "#FF69B4",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            idecontainsstandalonecode: {
                lineColor: "#1E90FF",
                arrowHead: "arrow",
                lineStyle: "solid"
            }
        },
        canvas: {
            backgroundColor: "#0D0221",
            gridColor: "#190535",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#0D0221",
            textColor: "#00FFFF",
            lineNumbersColor: "#FF00FF",
            highlightColor: "#FF1493"
        }
    },
    {
        name: "Anime Mecha",
        blocks: {
            class: {
                backgroundColor: "#1A1A1D",
                borderColor: "#C3073F",
                textColor: "#950740",
                headerColor: "#4E4E50"
            },
            class_function: {
                backgroundColor: "#4E4E50",
                borderColor: "#C3073F",
                textColor: "#950740",
                headerColor: "#6F2232"
            },
            code: {
                backgroundColor: "#6F2232",
                borderColor: "#C3073F",
                textColor: "#950740",
                headerColor: "#4E4E50"
            },
            class_standalone: {
                backgroundColor: "#1A1A1D",
                borderColor: "#C3073F",
                textColor: "#950740",
                headerColor: "#4E4E50"
            },
            standalone_function: {
                backgroundColor: "#4E4E50",
                borderColor: "#C3073F",
                textColor: "#950740",
                headerColor: "#6F2232"
            }
        },
        connections: {
            idecontainsclass: {
                lineColor: "#C3073F",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            class_contains_functions: {
                lineColor: "#950740",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            class_contains_standalone: {
                lineColor: "#6F2232",
                arrowHead: "diamond",
                lineStyle: "dotted"
            },
            inherits: {
                lineColor: "#FF0000",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            composes: {
                lineColor: "#FF4136",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            idecontainsstandalonecode: {
                lineColor: "#FF851B",
                arrowHead: "arrow",
                lineStyle: "solid"
            }
        },
        canvas: {
            backgroundColor: "#1A1A1D",
            gridColor: "#4E4E50",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#1A1A1D",
            textColor: "#950740",
            lineNumbersColor: "#6F2232",
            highlightColor: "#C3073F"
        }
    },
    {
        name: "Steampunk Coder",
        blocks: {
            class: {
                backgroundColor: "#2C3531",
                borderColor: "#D9B08C",
                textColor: "#FFCB9A",
                headerColor: "#116466"
            },
            class_function: {
                backgroundColor: "#116466",
                borderColor: "#D9B08C",
                textColor: "#FFCB9A",
                headerColor: "#0B3C3F"
            },
            code: {
                backgroundColor: "#0B3C3F",
                borderColor: "#D9B08C",
                textColor: "#FFCB9A",
                headerColor: "#116466"
            },
            class_standalone: {
                backgroundColor: "#2C3531",
                borderColor: "#D9B08C",
                textColor: "#FFCB9A",
                headerColor: "#116466"
            },
            standalone_function: {
                backgroundColor: "#116466",
                borderColor: "#D9B08C",
                textColor: "#FFCB9A",
                headerColor: "#0B3C3F"
            }
        },
        connections: {
            idecontainsclass: {
                lineColor: "#D9B08C",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            class_contains_functions: {
                lineColor: "#FFCB9A",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            class_contains_standalone: {
                lineColor: "#D1E8E2",
                arrowHead: "diamond",
                lineStyle: "dotted"
            },
            inherits: {
                lineColor: "#A3A380",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            composes: {
                lineColor: "#D4A76A",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            idecontainsstandalonecode: {
                lineColor: "#8E733F",
                arrowHead: "arrow",
                lineStyle: "solid"
            }
        },
        canvas: {
            backgroundColor: "#2C3531",
            gridColor: "#116466",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#2C3531",
            textColor: "#FFCB9A",
            lineNumbersColor: "#D9B08C",
            highlightColor: "#116466"
        }
    },
    {
        name: "Studio Ghibli Inspired",
        blocks: {
            class: {
                backgroundColor: "#D5F4E6",
                borderColor: "#80B192",
                textColor: "#2C5F2D",
                headerColor: "#97C1A9"
            },
            class_function: {
                backgroundColor: "#97C1A9",
                borderColor: "#80B192",
                textColor: "#2C5F2D",
                headerColor: "#B2D8B9"
            },
            code: {
                backgroundColor: "#B2D8B9",
                borderColor: "#80B192",
                textColor: "#2C5F2D",
                headerColor: "#97C1A9"
            },
            class_standalone: {
                backgroundColor: "#D5F4E6",
                borderColor: "#80B192",
                textColor: "#2C5F2D",
                headerColor: "#97C1A9"
            },
            standalone_function: {
                backgroundColor: "#97C1A9",
                borderColor: "#80B192",
                textColor: "#2C5F2D",
                headerColor: "#B2D8B9"
            }
        },
        connections: {
            idecontainsclass: {
                lineColor: "#2C5F2D",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            class_contains_functions: {
                lineColor: "#80B192",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            class_contains_standalone: {
                lineColor: "#4B8F6B",
                arrowHead: "diamond",
                lineStyle: "dotted"
            },
            inherits: {
                lineColor: "#1E4D2B",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            composes: {
                lineColor: "#6B9080",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            idecontainsstandalonecode: {
                lineColor: "#A4C3B2",
                arrowHead: "arrow",
                lineStyle: "solid"
            }
        },
        canvas: {
            backgroundColor: "#EAF4F4",
            gridColor: "#CCE3DE",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#EAF4F4",
            textColor: "#2C5F2D",
            lineNumbersColor: "#6B9080",
            highlightColor: "#80B192"
        }
    },
    {
        name: "Blade Runner 2049",
        blocks: {
            class: {
                backgroundColor: "#0F1215",
                borderColor: "#F6A02D",
                textColor: "#7AD1DD",
                headerColor: "#1B2023"
            },
            class_function: {
                backgroundColor: "#1B2023",
                borderColor: "#F6A02D",
                textColor: "#7AD1DD",
                headerColor: "#2C3440"
            },
            code: {
                backgroundColor: "#2C3440",
                borderColor: "#F6A02D",
                textColor: "#7AD1DD",
                headerColor: "#1B2023"
            },
            class_standalone: {
                backgroundColor: "#0F1215",
                borderColor: "#F6A02D",
                textColor: "#7AD1DD",
                headerColor: "#1B2023"
            },
            standalone_function: {
                backgroundColor: "#1B2023",
                borderColor: "#F6A02D",
                textColor: "#7AD1DD",
                headerColor: "#2C3440"
            }
        },
        connections: {
            idecontainsclass: {
                lineColor: "#F6A02D",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            class_contains_functions: {
                lineColor: "#7AD1DD",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            class_contains_standalone: {
                lineColor: "#EB4D4B",
                arrowHead: "diamond",
                lineStyle: "dotted"
            },
            inherits: {
                lineColor: "#FF6B6B",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            composes: {
                lineColor: "#4ECDC4",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            idecontainsstandalonecode: {
                lineColor: "#45B7D1",
                arrowHead: "arrow",
                lineStyle: "solid"
            }
        },
        canvas: {
            backgroundColor: "#0F1215",
            gridColor: "#1B2023",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#0F1215",
            textColor: "#7AD1DD",
            lineNumbersColor: "#F6A02D",
            highlightColor: "#EB4D4B"
        }
    }
];

export default customTemplates;