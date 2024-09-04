import { useState } from "react";

const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: false },
  { id: 3, description: "Shoes", quantity: 4, packed: false },
];

export default function App() {
  const [items, setItems] = useState(initialItems);

  function handleAddItem(description, quantity) {
    const newItem = { description, quantity, packed: false, id: Date.now() };
    setItems((prevItems) => [...prevItems, newItem]);
  }

  function togglePacked(id) {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function onDeleteItem(id) {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }

  function onClearList() {
    const confirmed = window.confirm(
      "Are you sure ,you want to delete all the items ?"
    );
    if (confirmed) setItems([]);
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItem={handleAddItem} />
      <PackingList
        items={items}
        setItems={setItems}
        onTogglePacked={togglePacked}
        onDeleteItem={onDeleteItem}
        onClearList={onClearList}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>🌴Far Away💼</h1>;
}

function Form({ onAddItem }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;
    onAddItem(description, quantity);
    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your next trip?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}

function PackingList({ items, onTogglePacked, onDeleteItem, onClearList }) {
  const [SortBy, setSortBy] = useState("input");
  return (
    <div className="list">
      <ul>
        {items.map((item) => (
          <Item
            item={item}
            key={item.id}
            onTogglePacked={onTogglePacked}
            onDeleteItem={onDeleteItem}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={SortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort By input order</option>
          <option value="description">Sort By description</option>
          <option value="packed">Sort By packing status</option>
        </select>
        <button onClick={onClearList}>Clear the list</button>
      </div>
    </div>
  );
}

function Item({ item, onTogglePacked, onDeleteItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onTogglePacked(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>✖️</button>
    </li>
  );
}

function Stats({ items }) {
  const totalItems = items.length;
  const packedItems = items.filter((item) => item.packed).length;
  const packedPercentage = totalItems ? (packedItems / totalItems) * 100 : 0;

  return (
    <footer className="stats">
      You have {totalItems} items in your list, and you have already packed{" "}
      {packedPercentage.toFixed(0)}% of them.
    </footer>
  );
}
