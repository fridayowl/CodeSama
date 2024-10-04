const customTemplates = [
    {
        name: "Dark Neon",
        blocks: {
            class: {
                backgroundColor: "#2D3748",
                borderColor: "#00FF00",
                textColor: "#00FFFF"
            },
            class_function: {
                backgroundColor: "#1A202C",
                borderColor: "#FF00FF",
                textColor: "#FFFFFF"
            },
            code: {
                backgroundColor: "#4A5568",
                borderColor: "#FFA500",
                textColor: "#F7FAFC"
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
        name: "Pastel Dream",
        blocks: {
            class: {
                backgroundColor: "#FAE8E0",
                borderColor: "#B8D8D8",
                textColor: "#5E6472"
            },
            class_function: {
                backgroundColor: "#E8F3F3",
                borderColor: "#D3E0DC",
                textColor: "#5E6472"
            },
            code: {
                backgroundColor: "#FFF5EB",
                borderColor: "#FFCAD4",
                textColor: "#5E6472"
            }
        },
        connections: {
            uses: {
                lineColor: "#B8D8D8",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            class_contains_functions: {
                lineColor: "#D3E0DC",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            class_to_standalone: {
                lineColor: "#FFCAD4",
                arrowHead: "circle",
                lineStyle: "dotted"
            }
        },
        canvas: {
            backgroundColor: "#FFF5EB",
            gridColor: "#FAE8E0",
            gridSpacing: 25
        },
        ide: {
            backgroundColor: "#E8F3F3",
            textColor: "#5E6472",
            lineNumbersColor: "#B8D8D8",
            highlightColor: "#FFCAD4"
        }
    },
    {
        name: "Forest Tranquility",
        blocks: {
            class: {
                backgroundColor: "#2C5F2D",
                borderColor: "#97BC62",
                textColor: "#DAE5D0"
            },
            class_function: {
                backgroundColor: "#1E441E",
                borderColor: "#97BC62",
                textColor: "#DAE5D0"
            },
            code: {
                backgroundColor: "#4A7856",
                borderColor: "#97BC62",
                textColor: "#DAE5D0"
            }
        },
        connections: {
            uses: {
                lineColor: "#97BC62",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            class_contains_functions: {
                lineColor: "#DAE5D0",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            class_to_standalone: {
                lineColor: "#FCB9AA",
                arrowHead: "circle",
                lineStyle: "dotted"
            }
        },
        canvas: {
            backgroundColor: "#2C5F2D",
            gridColor: "#4A7856",
            gridSpacing: 30
        },
        ide: {
            backgroundColor: "#1E441E",
            textColor: "#DAE5D0",
            lineNumbersColor: "#97BC62",
            highlightColor: "#FCB9AA"
        }
    },
    {
        name: "Ocean Breeze",
        blocks: {
            class: {
                backgroundColor: "#E3F2FD",
                borderColor: "#1E88E5",
                textColor: "#0D47A1"
            },
            class_function: {
                backgroundColor: "#BBDEFB",
                borderColor: "#1E88E5",
                textColor: "#0D47A1"
            },
            code: {
                backgroundColor: "#90CAF9",
                borderColor: "#1E88E5",
                textColor: "#0D47A1"
            }
        },
        connections: {
            uses: {
                lineColor: "#1E88E5",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            class_contains_functions: {
                lineColor: "#0D47A1",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            class_to_standalone: {
                lineColor: "#64B5F6",
                arrowHead: "circle",
                lineStyle: "dotted"
            }
        },
        canvas: {
            backgroundColor: "#E3F2FD",
            gridColor: "#BBDEFB",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#1565C0",
            textColor: "#E3F2FD",
            lineNumbersColor: "#90CAF9",
            highlightColor: "#64B5F6"
        }
    },
    {
        name: "Monochrome Elegance",
        blocks: {
            class: {
                backgroundColor: "#F5F5F5",
                borderColor: "#212121",
                textColor: "#212121"
            },
            class_function: {
                backgroundColor: "#E0E0E0",
                borderColor: "#212121",
                textColor: "#212121"
            },
            code: {
                backgroundColor: "#BDBDBD",
                borderColor: "#212121",
                textColor: "#212121"
            }
        },
        connections: {
            uses: {
                lineColor: "#616161",
                arrowHead: "triangle",
                lineStyle: "solid"
            },
            class_contains_functions: {
                lineColor: "#424242",
                arrowHead: "diamond",
                lineStyle: "dashed"
            },
            class_to_standalone: {
                lineColor: "#757575",
                arrowHead: "circle",
                lineStyle: "dotted"
            }
        },
        canvas: {
            backgroundColor: "#FAFAFA",
            gridColor: "#E0E0E0",
            gridSpacing: 25
        },
        ide: {
            backgroundColor: "#212121",
            textColor: "#FAFAFA",
            lineNumbersColor: "#BDBDBD",
            highlightColor: "#757575"
        }
    }
];

export default customTemplates;