/**
 * bundle.js ---------------
 *
 * build 1 - bundle.js - cached
 * build 2 - bundle.js
 *
 *
 * main page bundle - 10KB
 * chunk 1 - 50KB
 * chunk 2 - 75KB => modal
 *
 * button on the main page => click on a button =>
 * it loads chunk 2 => low network
 */

import "./styles.css";
import React from "react";

const data = [
  {
    name: "javascript",
    subFolders: [
      {
        name: "recursion",
        subFolders: [
          {
            name: "complexity",
          },
        ],
      },
      {
        name: "closure",
      },
    ],
  },
  {
    name: "react",
    subFolders: [
      {
        name: "virtualdom",
        subFolders: [
          {
            name: "realdom",
          },
        ],
      },
      {
        name: "hooks",
      },
    ],
  },
  {
    name: "css",
  },
  {
    name: "angular",
    subFolders: [
      {
        name: "data-binding",
      },
    ],
  },
  {
    name: "html",
  },
];

export default function App() {
  const [folder, setFolder] = React.useState(data);
  function HandleSubFolder({ folder }) {
    return (
      <>
        <li>
          {folder?.name}
          {folder?.subFolders && folder.subFolders.length > 0 && (
            <ul>
              {folder.subFolders.map((subFolder) => (
                <HandleSubFolder folder={subFolder} />
              ))}
            </ul>
          )}
        </li>
      </>
    );
  }
  return (
    <>
      <ul>
        {folder &&
          folder.map((data) => {
            return (
              <li>
                <HandleSubFolder folder={data} />
              </li>
            );
          })}
      </ul>
    </>
  );
}
