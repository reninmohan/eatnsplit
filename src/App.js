import { useState } from "react";
import { initialFriends } from "./initialFriends";

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [Friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriendForm() {
    setShowAddFriend((show) => !show);
  }

  function handleSelection(friend) {
    setSelectedFriend((selectedFriend) =>
      selectedFriend?.id === friend.id ? null : friend
    );
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        selectedFriend.id === friend.id
          ? { ...friend, balance: value + friend.balance }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          FriendList={Friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && (
          <FormAddFriend
            showAddFriend={showAddFriend}
            handleAddFriendForm={handleAddFriendForm}
          />
        )}

        <Button onClick={handleAddFriendForm}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({ FriendList, onSelection, selectedFriend }) {
  return (
    <ul>
      {FriendList.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ onSelection, friend, selectedFriend }) {
  let isSelected = friend.id === selectedFriend?.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      <p>
        {friend.balance === 0 && <span>You and {friend.name} are even</span>}

        {friend.balance > 0 && (
          <span className="green">
            {friend.name} owes you ${friend.balance}
          </span>
        )}

        {friend.balance < 0 && (
          <span className="red">
            You owe {friend.name} ${Math.abs(friend.balance)}
          </span>
        )}
      </p>

      <Button
        onClick={() => {
          onSelection(friend);
        }}
      >
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ setFriends, handleAddFriendForm }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    // let uid = Math.round(Math.random() * 1000000);
    let id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image: `${image}?u=${id}`,
      balance: 0,
    };
    setFriends((friends) => [...friends, newFriend]);
    setName("");
    setImage("https://i.pravatar.cc/48");
    handleAddFriendForm();
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label htmlFor="friendname">🧑‍🤝‍🧑Friendname</label>
      <input
        id="friendname"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label htmlFor="imageurl">🌄 Image Url</label>
      <input
        id="imageurl"
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const paidByFriend = bill ? bill - paidByUser : "";

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label htmlFor="money">💰 Bill value</label>
      <input
        id="money"
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label htmlFor="yourexpense">🕴️Your expense</label>
      <input
        id="yourexpense"
        type="number"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label htmlFor="friendexpense">🧑‍🤝‍🧑 {selectedFriend.name} expense</label>
      <input id="friendexpense" type="number" disabled value={paidByFriend} />
      <label htmlFor="whoispaying">🤑Who is paying the bill?</label>
      <select
        id="whoispaying"
        value={whoIsPaying}
        onChange={(e) => {
          setWhoIsPaying(e.target.value);
        }}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button onClick={handleSubmit}>Split bill</Button>
    </form>
  );
}
