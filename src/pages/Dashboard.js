import React, { useEffect, useState } from "react";
import { account, database } from "../appwrite/config";
import { useNavigate } from "react-router-dom";
import { Query } from "appwrite";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [todo, setTodo] = useState("");
  const [allTodo, setAllTodo] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await account.get();
        if(userData.emailVerification === false){
          navigate("/Login");
        }
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        alert("Please log in first!");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const viewtodo = async () => {
    if (!user || !user.email) return;
    try {
      const response = await database.listDocuments(
        process.env.REACT_APP_DB_ID,
        process.env.REACT_APP_COLLECTION_ID,
        [Query.equal("email", user.email)]
      );
      setAllTodo(response.documents || []);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  useEffect(() => {
    viewtodo();
  }, [user]);

  const addtodo = async () => {
    if (todo.trim() === "") {
      alert("Enter some Todo");
      return;
    }
    try {
      await database.createDocument(
        process.env.REACT_APP_DB_ID,
        process.env.REACT_APP_COLLECTION_ID,
        "unique()",
        {
          email: user.email,
          todo: todo,
        }
      );
      alert("Todo added successfully!");
      setTodo("");
      await viewtodo();
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      alert("Logout successful!");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const updatetodo = async (id) => {
    if (!user) return;
    try {
      const updatedTodo = await database.updateDocument(
        process.env.REACT_APP_DB_ID,
        process.env.REACT_APP_COLLECTION_ID,
        id,
        { todo: "I have completed the task!" }
      );
      setAllTodo((prevTodos) =>
        prevTodos.map((todo) => (todo.$id === id ? updatedTodo : todo))
      );
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const delettodo = async (id) => {
    try{
      var x = await database.deleteDocument(
        process.env.REACT_APP_DB_ID,
        process.env.REACT_APP_COLLECTION_ID,
        id,
        { todo: "I have completed the task!" }
      )
      console.log(x);
      await viewtodo();
    }
    catch(e){
      console.log(e);
    }
  }
  return (
    <div className="dashboard-container">
      {user ? (
        <>
          <h1>Welcome, {user.name}!</h1>
          <h2>Email: {user.email}</h2>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
          <br />
          <br />
          <input
            placeholder="Add your todo"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
          <br />
          <button onClick={addtodo}>Add Todo</button>
          <h3>Your Todos:</h3>
          {allTodo && allTodo.length > 0 ? (// checking alltodo properties, so itnitally call the function and then access the properties 
            <ul>
              {allTodo.map((item) => (
                <li key={item.$id}>
                  <span>{item.todo}</span>
                  <button onClick={() => updatetodo(item.$id)}>Update</button>
                  <button onClick={() => delettodo(item.$id)}>Delete</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No todos found.</p>
          )}
        </>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
};

export default Dashboard;
