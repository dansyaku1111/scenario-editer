# インポートデータ生成ガイド - プログラマー向け

## 概要

このガイドでは、各プログラミング言語でシナリオエディタ用のインポートデータを生成する方法を説明します。

## 目次

1. [Python での実装例](#python-での実装例)
2. [JavaScript/TypeScript での実装例](#javascripttypescript-での実装例)
3. [その他の言語での実装](#その他の言語での実装)
4. [実践的なサンプル](#実践的なサンプル)

---

## Python での実装例

### 基本的なシナリオビルダー

```python
import json
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional

class ScenarioBuilder:
    """シナリオデータを構築するビルダークラス"""
    
    def __init__(self):
        self.nodes: List[Dict[str, Any]] = []
        self.connections: List[Dict[str, Any]] = []
        self.metadata: Dict[str, Any] = {
            "version": "2.0.0",
            "exported_at": datetime.utcnow().isoformat() + "Z"
        }
    
    def add_start_node(self, x: float = 100, y: float = 100, 
                      name: Optional[str] = None,
                      node_id: Optional[str] = None) -> str:
        """開始ノードを追加"""
        node_id = node_id or f"start-{str(uuid.uuid4())[:8]}"
        node = {
            "id": node_id,
            "label": "Start",
            "type": "start",
            "x": x,
            "y": y,
            "data": {
                "title": "Start",
                "name": name or ""
            }
        }
        self.nodes.append(node)
        return node_id
    
    def add_action_node(self, title: str, text: str, x: float, y: float,
                       name: Optional[str] = None,
                       image_url: Optional[str] = None,
                       node_id: Optional[str] = None) -> str:
        """アクションノードを追加"""
        node_id = node_id or f"action-{str(uuid.uuid4())[:8]}"
        node = {
            "id": node_id,
            "label": "Action",
            "type": "action",
            "x": x,
            "y": y,
            "data": {
                "title": title,
                "name": name or "",
                "text": text,
                "imageUrl": image_url or "https://placehold.co/200x150"
            }
        }
        self.nodes.append(node)
        return node_id
    
    def add_condition_node(self, title: str, text: str, expression: str,
                          x: float, y: float,
                          name: Optional[str] = None,
                          node_id: Optional[str] = None) -> str:
        """条件ノードを追加"""
        node_id = node_id or f"condition-{str(uuid.uuid4())[:8]}"
        node = {
            "id": node_id,
            "label": "Condition",
            "type": "condition",
            "x": x,
            "y": y,
            "data": {
                "title": title,
                "name": name or "",
                "text": text,
                "conditionExpression": expression
            }
        }
        self.nodes.append(node)
        return node_id
    
    def add_character_node(self, name: str, role: str, description: str,
                          x: float, y: float,
                          label_name: Optional[str] = None,
                          attributes: Optional[Dict[str, Any]] = None,
                          relationships: Optional[List[Dict[str, str]]] = None,
                          image_url: Optional[str] = None,
                          node_id: Optional[str] = None) -> str:
        """キャラクターノードを追加
        
        Args:
            name: キャラクター名
            label_name: ノード上部に表示されるラベル名（オプション）
        """
        node_id = node_id or f"character-{str(uuid.uuid4())[:8]}"
        node = {
            "id": node_id,
            "label": "Character",
            "type": "character",
            "x": x,
            "y": y,
            "data": {
                "title": "Character",
                "name": label_name or "",
                "characterName": name,
                "role": role,
                "text": description,
                "imageUrl": image_url or "https://placehold.co/200x150",
                "attributes": attributes or {},
                "relationships": relationships or []
            }
        }
        self.nodes.append(node)
        return node_id
    
    def add_event_node(self, event_name: str, description: str,
                      x: float, y: float,
                      label_name: Optional[str] = None,
                      timestamp: Optional[str] = None,
                      location: Optional[str] = None,
                      duration: Optional[int] = None,
                      participants: Optional[List[str]] = None,
                      image_url: Optional[str] = None,
                      node_id: Optional[str] = None) -> str:
        """イベントノードを追加"""
        node_id = node_id or f"event-{str(uuid.uuid4())[:8]}"
        node = {
            "id": node_id,
            "label": "Event",
            "type": "event",
            "x": x,
            "y": y,
            "data": {
                "title": "Event",
                "name": label_name or "",
                "eventName": event_name,
                "text": description,
                "imageUrl": image_url or "https://placehold.co/200x150",
                "timestamp": timestamp or datetime.utcnow().isoformat() + "Z",
                "location": location or "",
                "duration": duration or 0,
                "participants": participants or []
            }
        }
        self.nodes.append(node)
        return node_id
    
    def add_end_node(self, x: float = 1000, y: float = 100,
                    name: Optional[str] = None,
                    node_id: Optional[str] = None) -> str:
        """終了ノードを追加"""
        node_id = node_id or f"end-{str(uuid.uuid4())[:8]}"
        node = {
            "id": node_id,
            "label": "End",
            "type": "end",
            "x": x,
            "y": y,
            "data": {
                "title": "End",
                "name": name or ""
            }
        }
        self.nodes.append(node)
        return node_id
    
    def connect(self, source_id: str, target_id: str,
               source_output: str = "exec", target_input: str = "exec",
               conn_id: Optional[str] = None) -> str:
        """ノード間を接続"""
        conn_id = conn_id or f"conn-{str(uuid.uuid4())[:8]}"
        connection = {
            "id": conn_id,
            "source": source_id,
            "sourceOutput": source_output,
            "target": target_id,
            "targetInput": target_input
        }
        self.connections.append(connection)
        return conn_id
    
    def set_metadata(self, description: Optional[str] = None,
                    author: Optional[str] = None,
                    tags: Optional[List[str]] = None):
        """メタデータを設定"""
        if description:
            self.metadata["description"] = description
        if author:
            self.metadata["author"] = author
        if tags:
            self.metadata["tags"] = tags
    
    def build(self) -> Dict[str, Any]:
        """シナリオデータを構築"""
        return {
            "nodes": self.nodes,
            "connections": self.connections,
            "metadata": self.metadata
        }
    
    def save(self, filename: str):
        """JSONファイルとして保存"""
        data = self.build()
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Scenario saved to {filename}")


# 使用例
def create_simple_scenario():
    """シンプルなシナリオを作成（v2.1.0対応）"""
    builder = ScenarioBuilder()
    
    # メタデータ設定
    builder.set_metadata(
        description="A simple story scenario",
        author="Python Script",
        tags=["example", "tutorial"]
    )
    
    # ノード追加（nameパラメータでラベル名を設定）
    start = builder.add_start_node(x=100, y=100, name="プロローグ")
    action1 = builder.add_action_node(
        title="Scene 1",
        text="The protagonist arrives at the mysterious mansion.",
        name="到着",
        x=350, y=100
    )
    condition = builder.add_condition_node(
        title="Check Door",
        text="Is the door locked?",
        expression="door_locked == true",
        name="ドアチェック",
        x=600, y=100
    )
    action2 = builder.add_action_node(
        title="Enter Mansion",
        text="The protagonist enters through the unlocked door.",
        name="突入",
        x=850, y=50
    )
    action3 = builder.add_action_node(
        title="Find Key",
        text="The protagonist searches for a key.",
        name="鍵探し",
        x=850, y=150
    )
    end = builder.add_end_node(x=1100, y=100, name="エピローグ")
    
    # 接続
    builder.connect(start, action1)
    builder.connect(action1, condition)
    builder.connect(condition, action2, source_output="false")
    builder.connect(condition, action3, source_output="true")
    builder.connect(action2, end)
    builder.connect(action3, end)
    
    # 保存
    builder.save("simple_scenario.json")
    return builder.build()


def create_character_scenario():
    """キャラクター中心のシナリオを作成（v2.1.0対応）"""
    builder = ScenarioBuilder()
    
    builder.set_metadata(
        description="Character interaction scenario",
        author="Python Script",
        tags=["character", "dialogue"]
    )
    
    # キャラクター作成（label_nameパラメータでノードラベルを設定）
    protagonist = builder.add_character_node(
        name="Alice",
        role="Protagonist",
        description="A brave detective",
        label_name="主人公",  # ← ノード上部に表示されるラベル
        x=100, y=200,
        attributes={
            "age": 28,
            "occupation": "Detective",
            "personality": "Curious and determined"
        }
    )
    
    sidekick = builder.add_character_node(
        name="Bob",
        role="Supporting",
        description="Alice's loyal partner",
        label_name="相棒",  # ← ノード上部に表示されるラベル
        x=100, y=400,
        attributes={
            "age": 32,
            "occupation": "Police Officer",
            "personality": "Reliable and cautious"
        }
    )
    
    # イベント作成
    meeting = builder.add_event_node(
        event_name="First Meeting",
        description="Alice and Bob meet at the crime scene",
        label_name="初対面",  # ← ノード上部に表示されるラベル
        x=400, y=300,
        location="Crime Scene",
        participants=[protagonist, sidekick]
    )
    
    # フロー
    start = builder.add_start_node(x=100, y=100, name="開始")
    action = builder.add_action_node(
        title="Investigation Begins",
        text="The team starts investigating",
        name="捜査開始",
        x=400, y=100
    )
    end = builder.add_end_node(x=700, y=100, name="終了")
    
    # 接続
    builder.connect(start, action)
    builder.connect(action, end)
    builder.connect(protagonist, meeting, 
                   source_output="entity", target_input="participants")
    builder.connect(sidekick, meeting,
                   source_output="entity", target_input="participants")
    
    builder.save("character_scenario.json")
    return builder.build()


if __name__ == "__main__":
    # シンプルなシナリオを作成
    print("Creating simple scenario...")
    create_simple_scenario()
    
    # キャラクターシナリオを作成
    print("Creating character scenario...")
    create_character_scenario()
    
    print("Done!")
```

---

## JavaScript/TypeScript での実装例

### TypeScript版シナリオビルダー

```typescript
// scenario-builder.ts

interface Node {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  data: Record<string, any>;
}

interface Connection {
  id: string;
  source: string;
  sourceOutput: string;
  target: string;
  targetInput: string;
}

interface Metadata {
  version: string;
  exported_at: string;
  description?: string;
  author?: string;
  tags?: string[];
}

interface ScenarioData {
  nodes: Node[];
  connections: Connection[];
  metadata: Metadata;
}

class ScenarioBuilder {
  private nodes: Node[] = [];
  private connections: Connection[] = [];
  private metadata: Metadata;

  constructor() {
    this.metadata = {
      version: "2.0.0",
      exported_at: new Date().toISOString()
    };
  }

  private generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  addStartNode(x: number = 100, y: number = 100, name?: string, nodeId?: string): string {
    nodeId = nodeId || this.generateId('start');
    this.nodes.push({
      id: nodeId,
      label: "Start",
      type: "start",
      x,
      y,
      data: { 
        title: "Start",
        name: name || ""
      }
    });
    return nodeId;
  }

  addActionNode(
    title: string,
    text: string,
    x: number,
    y: number,
    name?: string,
    imageUrl?: string,
    nodeId?: string
  ): string {
    nodeId = nodeId || this.generateId('action');
    this.nodes.push({
      id: nodeId,
      label: "Action",
      type: "action",
      x,
      y,
      data: {
        title,
        name: name || "",
        text,
        imageUrl: imageUrl || "https://placehold.co/200x150"
      }
    });
    return nodeId;
  }

  addConditionNode(
    title: string,
    text: string,
    expression: string,
    x: number,
    y: number,
    name?: string,
    nodeId?: string
  ): string {
    nodeId = nodeId || this.generateId('condition');
    this.nodes.push({
      id: nodeId,
      label: "Condition",
      type: "condition",
      x,
      y,
      data: {
        title,
        name: name || "",
        text,
        conditionExpression: expression
      }
    });
    return nodeId;
  }

  addCharacterNode(
    name: string,
    role: string,
    description: string,
    x: number,
    y: number,
    options?: {
      labelName?: string;  // ← ノード上部に表示されるラベル名
      attributes?: Record<string, any>;
      relationships?: Array<{ targetId: string; type: string; description?: string }>;
      imageUrl?: string;
      nodeId?: string;
    }
  ): string {
    const nodeId = options?.nodeId || this.generateId('character');
    this.nodes.push({
      id: nodeId,
      label: "Character",
      type: "character",
      x,
      y,
      data: {
        title: "Character",
        name: options?.labelName || "",
        characterName: name,
        role,
        text: description,
        imageUrl: options?.imageUrl || "https://placehold.co/200x150",
        attributes: options?.attributes || {},
        relationships: options?.relationships || []
      }
    });
    return nodeId;
  }

  addEventNode(
    eventName: string,
    description: string,
    x: number,
    y: number,
    options?: {
      labelName?: string;  // ← ノード上部に表示されるラベル名
      timestamp?: string;
      location?: string;
      duration?: number;
      participants?: string[];
      imageUrl?: string;
      nodeId?: string;
    }
  ): string {
    const nodeId = options?.nodeId || this.generateId('event');
    this.nodes.push({
      id: nodeId,
      label: "Event",
      type: "event",
      x,
      y,
      data: {
        title: "Event",
        name: options?.labelName || "",
        eventName,
        text: description,
        imageUrl: options?.imageUrl || "https://placehold.co/200x150",
        timestamp: options?.timestamp || new Date().toISOString(),
        location: options?.location || "",
        duration: options?.duration || 0,
        participants: options?.participants || []
      }
    });
    return nodeId;
  }

  addEndNode(x: number = 1000, y: number = 100, name?: string, nodeId?: string): string {
    nodeId = nodeId || this.generateId('end');
    this.nodes.push({
      id: nodeId,
      label: "End",
      type: "end",
      x,
      y,
      data: { 
        title: "End",
        name: name || ""
      }
    });
    return nodeId;
  }

  connect(
    sourceId: string,
    targetId: string,
    sourceOutput: string = "exec",
    targetInput: string = "exec",
    connId?: string
  ): string {
    connId = connId || this.generateId('conn');
    this.connections.push({
      id: connId,
      source: sourceId,
      sourceOutput,
      target: targetId,
      targetInput
    });
    return connId;
  }

  setMetadata(options: {
    description?: string;
    author?: string;
    tags?: string[];
  }): void {
    if (options.description) this.metadata.description = options.description;
    if (options.author) this.metadata.author = options.author;
    if (options.tags) this.metadata.tags = options.tags;
  }

  build(): ScenarioData {
    return {
      nodes: this.nodes,
      connections: this.connections,
      metadata: this.metadata
    };
  }

  toJSON(): string {
    return JSON.stringify(this.build(), null, 2);
  }

  save(filename: string): void {
    if (typeof window !== 'undefined') {
      // ブラウザ環境
      const blob = new Blob([this.toJSON()], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // Node.js環境
      const fs = require('fs');
      fs.writeFileSync(filename, this.toJSON(), 'utf-8');
      console.log(`Scenario saved to ${filename}`);
    }
  }
}

// 使用例
function createSimpleScenario(): void {
  const builder = new ScenarioBuilder();

  builder.setMetadata({
    description: "A simple story scenario",
    author: "TypeScript Script",
    tags: ["example", "tutorial"]
  });

  // v2.1.0: nameパラメータでノードラベルを設定
  const start = builder.addStartNode(100, 100, "プロローグ");
  const action1 = builder.addActionNode(
    "Scene 1",
    "The protagonist arrives at the mysterious mansion.",
    350, 100,
    "到着"  // ← ノード上部に表示されるラベル名
  );
  const condition = builder.addConditionNode(
    "Check Door",
    "Is the door locked?",
    "door_locked == true",
    600, 100,
    "ドアチェック"  // ← ノード上部に表示されるラベル名
  );
  const action2 = builder.addActionNode(
    "Enter Mansion",
    "The protagonist enters through the unlocked door.",
    850, 50,
    "突入"
  );
  const action3 = builder.addActionNode(
    "Find Key",
    "The protagonist searches for a key.",
    850, 150,
    "鍵探し"
  );
  const end = builder.addEndNode(1100, 100, "エピローグ");

  builder.connect(start, action1);
  builder.connect(action1, condition);
  builder.connect(condition, action2, "false");
  builder.connect(condition, action3, "true");
  builder.connect(action2, end);
  builder.connect(action3, end);

  builder.save("simple_scenario.json");
}

// エクスポート
export { ScenarioBuilder, ScenarioData, Node, Connection, Metadata };
export default ScenarioBuilder;
```

---

## その他の言語での実装

### C# での実装例

```csharp
using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;

public class ScenarioBuilder
{
    private List<Node> nodes = new List<Node>();
    private List<Connection> connections = new List<Connection>();
    private Metadata metadata;

    public ScenarioBuilder()
    {
        metadata = new Metadata
        {
            Version = "2.0.0",
            ExportedAt = DateTime.UtcNow.ToString("o")
        };
    }

    public string AddStartNode(double x = 100, double y = 100, string nodeId = null)
    {
        nodeId = nodeId ?? $"start-{Guid.NewGuid().ToString().Substring(0, 8)}";
        nodes.Add(new Node
        {
            Id = nodeId,
            Label = "Start",
            Type = "start",
            X = x,
            Y = y,
            Data = new Dictionary<string, object> { { "title", "Start" } }
        });
        return nodeId;
    }

    public string AddActionNode(string title, string text, double x, double y, 
                               string imageUrl = null, string nodeId = null)
    {
        nodeId = nodeId ?? $"action-{Guid.NewGuid().ToString().Substring(0, 8)}";
        nodes.Add(new Node
        {
            Id = nodeId,
            Label = "Action",
            Type = "action",
            X = x,
            Y = y,
            Data = new Dictionary<string, object>
            {
                { "title", title },
                { "text", text },
                { "imageUrl", imageUrl ?? "https://placehold.co/200x150" }
            }
        });
        return nodeId;
    }

    public string Connect(string sourceId, string targetId, 
                         string sourceOutput = "exec", string targetInput = "exec",
                         string connId = null)
    {
        connId = connId ?? $"conn-{Guid.NewGuid().ToString().Substring(0, 8)}";
        connections.Add(new Connection
        {
            Id = connId,
            Source = sourceId,
            SourceOutput = sourceOutput,
            Target = targetId,
            TargetInput = targetInput
        });
        return connId;
    }

    public ScenarioData Build()
    {
        return new ScenarioData
        {
            Nodes = nodes,
            Connections = connections,
            Metadata = metadata
        };
    }

    public void Save(string filename)
    {
        var data = Build();
        var json = JsonSerializer.Serialize(data, new JsonSerializerOptions
        {
            WriteIndented = true
        });
        File.WriteAllText(filename, json);
        Console.WriteLine($"Scenario saved to {filename}");
    }
}

// データクラス
public class Node
{
    public string Id { get; set; }
    public string Label { get; set; }
    public string Type { get; set; }
    public double X { get; set; }
    public double Y { get; set; }
    public Dictionary<string, object> Data { get; set; }
}

public class Connection
{
    public string Id { get; set; }
    public string Source { get; set; }
    public string SourceOutput { get; set; }
    public string Target { get; set; }
    public string TargetInput { get; set; }
}

public class Metadata
{
    public string Version { get; set; }
    public string ExportedAt { get; set; }
    public string Description { get; set; }
    public string Author { get; set; }
    public List<string> Tags { get; set; }
}

public class ScenarioData
{
    public List<Node> Nodes { get; set; }
    public List<Connection> Connections { get; set; }
    public Metadata Metadata { get; set; }
}
```

---

## 実践的なサンプル

### 1. ゲームクエストのシナリオ

```python
def create_quest_scenario():
    """RPGゲームのクエストシナリオ"""
    builder = ScenarioBuilder()
    
    builder.set_metadata(
        description="Dragon Slayer Quest",
        author="Quest Designer",
        tags=["RPG", "quest", "dragon"]
    )
    
    # キャラクター
    hero = builder.add_character_node(
        name="Sir Galahad",
        role="Protagonist",
        description="A brave knight",
        x=100, y=300,
        attributes={
            "level": 15,
            "class": "Knight",
            "hp": 250,
            "strength": 85
        }
    )
    
    npc = builder.add_character_node(
        name="Village Elder",
        role="Supporting",
        description="Wise old man",
        x=100, y=500,
        attributes={
            "age": 78,
            "role": "Quest Giver"
        }
    )
    
    # クエストフロー
    start = builder.add_start_node(100, 100)
    
    accept_quest = builder.add_action_node(
        "Accept Quest",
        "The hero accepts the quest to slay the dragon",
        350, 100
    )
    
    travel = builder.add_action_node(
        "Travel to Mountain",
        "Journey through the dark forest to Dragon Mountain",
        600, 100
    )
    
    battle = builder.add_event_node(
        "Dragon Battle",
        "Epic battle with the ancient dragon",
        x=850, y=100,
        location="Dragon's Lair",
        duration=1800,  # 30 minutes
        participants=[hero]
    )
    
    check_victory = builder.add_condition_node(
        "Battle Result",
        "Did the hero defeat the dragon?",
        "dragon_defeated == true",
        1100, 100
    )
    
    victory = builder.add_action_node(
        "Victory!",
        "The hero returns victorious",
        1350, 50
    )
    
    defeat = builder.add_action_node(
        "Defeat",
        "The hero must try again",
        1350, 150
    )
    
    end_success = builder.add_end_node(1600, 50)
    end_fail = builder.add_end_node(1600, 150)
    
    # 接続
    builder.connect(start, accept_quest)
    builder.connect(accept_quest, travel)
    builder.connect(travel, battle)
    builder.connect(battle, check_victory)
    builder.connect(check_victory, victory, source_output="true")
    builder.connect(check_victory, defeat, source_output="false")
    builder.connect(victory, end_success)
    builder.connect(defeat, end_fail)
    
    builder.save("quest_scenario.json")
```

### 2. インタラクティブストーリー

```typescript
function createInteractiveStory(): void {
  const builder = new ScenarioBuilder();
  
  builder.setMetadata({
    description: "Mystery at the Mansion - Interactive Story",
    author: "Story Designer",
    tags: ["mystery", "interactive", "choices"]
  });
  
  // キャラクター設定
  const detective = builder.addCharacterNode(
    "Detective Sarah",
    "Protagonist",
    "A brilliant detective with a keen eye for detail",
    100, 300,
    {
      attributes: {
        intelligence: 95,
        observation: 90,
        charisma: 75
      }
    }
  );
  
  // ストーリーフロー
  const start = builder.addStartNode(100, 100);
  
  const intro = builder.addActionNode(
    "Arrival",
    "You arrive at the mysterious Blackwood Mansion on a stormy night.",
    350, 100
  );
  
  const choice1 = builder.addConditionNode(
    "Enter the Mansion",
    "The front door is slightly ajar. Do you enter?",
    "player_choice == 'enter'",
    600, 100
  );
  
  const exploreInside = builder.addActionNode(
    "Inside the Mansion",
    "You step inside. The hall is dimly lit by flickering candles.",
    850, 50
  );
  
  const waitOutside = builder.addActionNode(
    "Wait Outside",
    "You decide to wait for backup. Time passes slowly...",
    850, 150
  );
  
  const discoverClue = builder.addEventNode(
    "Clue Discovery",
    "You find a mysterious letter on the table",
    1100, 50,
    {
      location: "Main Hall",
      participants: [detective]
    }
  );
  
  const timeout = builder.addEventNode(
    "Time Out",
    "Your backup arrives, but valuable time was lost",
    1100, 150
  );
  
  const solve = builder.addActionNode(
    "Case Solved",
    "With the clues gathered, you solve the mystery!",
    1350, 50
  );
  
  const fail = builder.addActionNode(
    "Case Unsolved",
    "The trail goes cold. The mystery remains...",
    1350, 150
  );
  
  const end = builder.addEndNode(1600, 100);
  
  // 接続
  builder.connect(start, intro);
  builder.connect(intro, choice1);
  builder.connect(choice1, exploreInside, "true");
  builder.connect(choice1, waitOutside, "false");
  builder.connect(exploreInside, discoverClue);
  builder.connect(waitOutside, timeout);
  builder.connect(discoverClue, solve);
  builder.connect(timeout, fail);
  builder.connect(solve, end);
  builder.connect(fail, end);
  
  builder.save("interactive_story.json");
}
```

---

## まとめ

これらの実装例とサンプルを参考に、各プログラミング言語でシナリオデータを生成できます。

### 重要なポイント

1. **ユニークID**: 各ノードと接続にユニークなIDを割り当てる
2. **座標計算**: ノードの配置を論理的に計算する（左から右、上から下）
3. **データ検証**: 生成したJSONが仕様に準拠しているか確認
4. **エラーハンドリング**: 不正なデータを生成しないよう注意

### 🆕 v2.1.0の新機能

**ノードラベル名（`name`フィールド）**
- 全てのノードタイプに `name` フィールドを追加可能
- ノード上部に表示され、視認性が向上
- 空文字列の場合は非表示
- シナリオの可読性とメンテナンス性が大幅に向上

**使用例:**
```python
# Python
builder.add_action_node(
    title="Battle Start",
    text="The battle begins!",
    name="第一戦闘",  # ← ノード上部に表示
    x=100, y=100
)
```

```typescript
// TypeScript
builder.addActionNode(
    "Battle Start",
    "The battle begins!",
    100, 100,
    "第一戦闘"  // ← ノード上部に表示
);
```

**活用シーン:**
- シナリオのステップ番号付け
- キャラクター識別
- イベント分類
- 条件分岐の明確化

### 推奨ツール

- **JSONバリデーター**: [JSONLint](https://jsonlint.com/)
- **スキーマ検証**: JSON Schemaを使用した自動検証
- **ビジュアライザー**: 生成したデータをエディタで確認

---

**ドキュメントバージョン:** 2.1.0  
**最終更新日:** 2025-01-05
