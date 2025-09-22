export const jsonSchema = {
    "type": "object",
    "properties": {
        "id": { "type": "string" },
        "nodes": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": { "type": "string" },
                    "label": { "type": "string" },
                    "position": {
                        "type": "object",
                        "properties": {
                            "x": { "type": "number" },
                            "y": { "type": "number" }
                        },
                        "required": ["x", "y"]
                    },
                    "inputs": { "type": "object" },
                    "outputs": { "type": "object" },
                    "controls": { "type": "object" },
                    "data": { "type": "object" }
                },
                "required": ["id", "label", "position"]
            }
        },
        "connections": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": { "type": "string" },
                    "source": { "type": "string" },
                    "target": { "type": "string" },
                    "sourceOutput": { "type": "string" },
                    "targetInput": { "type": "string" }
                },
                "required": ["id", "source", "target", "sourceOutput", "targetInput"]
            }
        }
    },
    "required": ["id", "nodes", "connections"]
};
