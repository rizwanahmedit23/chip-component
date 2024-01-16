import React, { useState, ChangeEvent, FocusEvent, KeyboardEvent } from "react";
import { Form, Row, Col } from "react-bootstrap";
import "./ChipComponent.css";
import '@fortawesome/fontawesome-free/css/all.min.css';


interface User {
  id: number;
  name: string;
  email: string;
}

const ChipComponent: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [chipOrder, setChipOrder] = useState<string[]>([]);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [highlightLastChip, setHighlightLastChip] = useState<boolean>(false);
  const [backspaceCount, setBackspaceCount] = useState<number>(0);
  const [isMouseOverSuggestions, setIsMouseOverSuggestions] = useState<boolean>(false);

  const allUsers: User[] = [
    { id: 1, name: "John", email: "john@example.com" },
    { id: 2, name: "Jane", email: "jane@example.com" },
    { id: 3, name: "Doe", email: "doe@example.com" },
    { id: 4, name: "Alice", email: "alice@example.com" },
    { id: 5, name: "Bob", email: "bob@example.com" },
  ];

  const filteredNames: User[] = allUsers.filter(
    (user) =>
      (inputValue.trim() === "" ||
        user.name.toLowerCase().includes(inputValue.toLowerCase())) &&
      !selectedChips.includes(user.name)
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddChip = (user: User) => {
    const { name } = user;

    if (!selectedChips.includes(name)) {
      const newChips: string[] = [...selectedChips, name];
      setSelectedChips(newChips);
      setChipOrder([...chipOrder, name]);
      setInputValue("");
      setIsInputFocused(false);
      setHighlightLastChip(false);
      setBackspaceCount(0);
    }
  };

  const handleRemoveChip = (name: string) => {
    const updatedChips: string[] = selectedChips.filter((chip) => chip !== name);
    setSelectedChips(updatedChips);
    setChipOrder(chipOrder.filter((chip) => chip !== name));
    setHighlightLastChip(false);
    setBackspaceCount(0);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleMouseEnterSuggestions = () => {
    setIsMouseOverSuggestions(true);
  };

  const handleMouseLeaveSuggestions = () => {
    setIsMouseOverSuggestions(false);
  };

  const handleInputBlur = () => {
    if (!isMouseOverSuggestions) {
      setIsInputFocused(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && inputValue.trim() === "") {
      // Backspace pressed on an empty input field
      setBackspaceCount(backspaceCount + 1);
      if (backspaceCount === 1 && chipOrder.length > 0) {
        // Second consecutive backspace, remove the last added chip
        const lastAddedChip: string = chipOrder[chipOrder.length - 1];
        handleRemoveChip(lastAddedChip);
      } else if (backspaceCount === 0 && chipOrder.length > 0) {
        setHighlightLastChip(true);
      }
    } else {
      // Reset backspace count for other keys
      setBackspaceCount(0);
      setHighlightLastChip(false);
    }
  };

  return (
    <Row className="chip-component">
      <Col xs={8} className="selected-chips-container">
        {selectedChips.map((chip, index) => (
          <span
            key={chip}
            className={`chip ${highlightLastChip && index === selectedChips.length - 1 ? "highlighted" : ""}`}
          >
            <img className="user-image" src={require('./assets/pic5.png')} alt="image not found" /> {chip}
            <span className="chip-remove" onClick={() => handleRemoveChip(chip)}>
              &#10006;
            </span>
          </span>
        ))}
      </Col>
      <Col xs={4} className="input-container">
        <Form.Control
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder="Type to search..."
          className="invisible-border"
        />
        {(isInputFocused || inputValue.trim() !== "") && (
          <div
            className="autocomplete-list"
            onMouseEnter={handleMouseEnterSuggestions}
            onMouseLeave={handleMouseLeaveSuggestions}
          >
            {filteredNames.map((user) => (
              <div
                key={user.id}
                className="autocomplete-item"
                onClick={() => handleAddChip(user)}
              >
                <img className="user-image" src={require('./assets/pic5.png')} alt="image not found" />
                <span>{user.name}</span>
                <span className="autocomplete-email">{user.email}</span>
              </div>
            ))}
          </div>
        )}
      </Col>
    </Row>
  );
};

export default ChipComponent;
