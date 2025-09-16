from graphviz import Digraph

# Create a new directed graph
er_diagram = Digraph(format="png")
er_diagram.attr(rankdir="LR")

# Entities
er_diagram.node("Users", shape="box")
er_diagram.node("Properties", shape="box")
er_diagram.node("Reports", shape="box")
er_diagram.node("Transactions", shape="box")

# Relationships
er_diagram.edge("Users", "Properties", label="1..* owns")
er_diagram.edge("Properties", "Reports", label="1..* has")
er_diagram.edge("Users", "Reports", label="1..* submits")
er_diagram.edge("Users", "Transactions", label="buyer/seller")
er_diagram.edge("Properties", "Transactions", label="involved in")

# Render to file and display
er_diagram.render("/mnt/data/er_diagram", format="png", cleanup=False)
"/mnt/data/er_diagram.png"
