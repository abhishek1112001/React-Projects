import React from "react";
import Header from "./components/headers/Header";
import Pages from "./components/mainpages/Pages";
import { BrowserRouter as Router } from "react-router-dom";
import { DataProvider } from "./GlobalState";

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
          <Header />
          <Pages />
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
