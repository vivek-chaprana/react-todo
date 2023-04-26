import React, { useEffect, useState } from "react";
import todo from "../Assets/todo.svg";

const getLocalItems = () => {
  const list = localStorage.getItem("todo-list");
  return list ? JSON.parse(list) : [];
};

const getLocalDeletedItems = () => {
  const list = localStorage.getItem("deleted-list");
  console.log("deletedList", list);

  return list ? JSON.parse(list) : [];
};

const Todo = () => {
  const [inputData, setInputData] = useState("");
  const [items, setItems] = useState(getLocalItems());
  const [deletedItems, setDeletedItems] = useState(getLocalDeletedItems());
  const [toggleSubmit, setToggleSubmit] = useState(true);
  const [currItemId, setCurrItemId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    localStorage.setItem("todo-list", JSON.stringify(items));
    localStorage.setItem("deleted-list", JSON.stringify(deletedItems));
  }, [items, deletedItems]);

  const addItem = () => {
    if (!inputData) {
      return;
    } else if (inputData && !toggleSubmit) {
      setItems(
        items.map((elem) => {
          return elem.id === currItemId ? { ...elem, name: inputData } : elem;
        })
      );
      setToggleSubmit(true);
      setInputData("");
      setCurrItemId(null);
    } else {
      const inputField = {
        id: new Date().getTime().toString(),
        name: inputData,
      };
      setItems([...items, inputField]);
      setInputData("");
    }
  };

  const deleteItem = (id) => {
    const updatedArr = items.filter((elem) => elem.id !== id);
    const elem = items.find((elem) => elem.id === id);
    setDeletedItems([...deletedItems, elem]);
    setItems(updatedArr);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) addItem();
  };

  const editItem = (id) => {
    const elem = items.find((elem) => elem.id === id);
    setToggleSubmit(false);
    setInputData(elem.name);
    setCurrItemId(elem.id);
  };

  const undoDelete = (obj) => {
    const updatedDeletedArr = deletedItems.filter((elem) => obj.id !== elem.id);
    setDeletedItems(updatedDeletedArr);
    setItems([...items, obj]);
  };

  const undoAll = () => {
    setDeletedItems([]);
  };

  const deleteAll = () => {
    setDeletedItems([...deletedItems, ...items]);
    setItems([]);
  };

  return (
    <>
      <div className="main-div">
        <div className="child-div">
          <figure>
            <img src={todo} alt="todologo" />
            <figcaption>Add Your List Here ✌</figcaption>
          </figure>

          <div className="addItems">
            <input
              type="text"
              placeholder="✍ Add Items..."
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {toggleSubmit ? (
              <i
                className="fa fa-plus add-btn"
                title="Add Item"
                onClick={addItem}
              ></i>
            ) : (
              <i
                className="far fa-edit add-btn"
                title="Update Item"
                onClick={addItem}
              ></i>
            )}
          </div>

          <div className="showItems">
            {items.map((elem) => {
              return (
                <div className="eachItem" key={elem.id}>
                  <h3>{elem.name}</h3>
                  <div className="todo-btn">
                    <i
                      className="far fa-edit add-btn"
                      title="Edit Item"
                      onClick={() => editItem(elem.id)}
                    ></i>
                    <i
                      className="far fa-trash-alt add-btn"
                      title="Delete Item"
                      onClick={() => deleteItem(elem.id)}
                    ></i>
                  </div>
                </div>
              );
            })}
          </div>

          {/* clear all button  */}
          <div className="showItems">
            <button
              className="btn effect04"
              data-sm-link-text="Remove All"
              onClick={deleteAll}
            >
              <span> CLEAR LIST </span>{" "}
            </button>
          </div>

          {/* Deleted Items Accordion */}
          <div className="showItems deletedDiv">
            <div className="label" onClick={() => setIsVisible(!isVisible)}>
              <p>Deleted Items</p>
              <p>
                {isVisible ? (
                  <i className="fa fa-minus" title="Collapse"></i>
                ) : (
                  <i className="fa fa-plus" title="Expand"></i>
                )}
              </p>
            </div>
            {isVisible && (
              <>
                <div className="deletedContent">
                  {deletedItems.map((elem) => {
                    return (
                      <div className="deletedItem" key={elem.id}>
                        <h3>{elem.name}</h3>
                        <div className="todo-btn">
                          <i
                            className="fas fa-undo add-btn"
                            title="Undo Delete"
                            onClick={() => undoDelete(elem)}
                          ></i>
                        </div>
                      </div>
                    );
                  })}
                  <div className="showItems">
                    <button
                      className="btn effect04"
                      data-sm-link-text="Empty Bin"
                      onClick={undoAll}
                    >
                      <span> CLEAR LIST </span>{" "}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Todo;
