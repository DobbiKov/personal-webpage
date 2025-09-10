import React, { useEffect, useState, useRef } from 'react';
import Header from "./Header.js"
import "./LectureNotes.css"

const NoteCard = ({ note }) => (
    <div className="note-card">
      <div className="note-content">
        <h4>{note.name}</h4>
        <a href={note.url} target="_blank" rel="noopener noreferrer" className="note-link">
          Open Notes
        </a>
      </div>
    </div>
  );
  
  const Subsection = ({ subsection }) => (
    <div className="subsection">
      <h3 className="subsection-title">{subsection.subsection}</h3>
      <div className="notes-grid">
        {subsection.notes.map((note, index) => (
          <NoteCard key={index} note={note} />
        ))}
      </div>
    </div>
  );
  
  const Section = React.forwardRef(({ section }, ref) => (
    <div className="section" ref={ref}>
      <h2 className="section-title">{section.sections}</h2>
      {section.subsections.map((subsection, index) => (
        <Subsection key={index} subsection={subsection} />
      ))}
    </div>
  ));

const LectureNotes = () => {
    const [data, setData] = useState([]); // State to store the JSON data
    const [loading, setLoading] = useState(true); // State for loading spinner
    const [error, setError] = useState(null); // State for errors

    const sectionRefs = useRef([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch("https://dobbikov.com/lecture-notes"); // Replace with your API URL
            if (!response.ok) {
              throw new Error("Failed to fetch data");
            }
            const json = await response.json();
            setData(json);
            setLoading(false);
          } catch (err) {
            setError(err.message);
            setLoading(false);
          }
        };
        fetchData();
      }, []);
    
      const handleScrollToSection = (index) => {
        sectionRefs.current[index].scrollIntoView({ behavior: "smooth" });
      };

    return (
    <div className="lect_notes_main_cont">
        <Header active={"lecture_notes"}/>
        <div className="lect_notes_main_cont_inner">


        <h1 className="lect_notes_page-title">Lecture Notes</h1>
        <h2 className="lect_notes_page-sub_title">by Yehor Korotenko</h2>

        <div className='lect_notes_content-container'>
            <div className="table-of-contents">
                <h3>Table of Contents</h3>
                <ul>
                {data.map((section, index) => (
                    <li key={index}>
                    <button onClick={() => handleScrollToSection(index)}>
                        {section.sections}
                    </button>
                    </li>
                ))}
                </ul>
            </div>
            
            <div className="lect_notes_sections">
                {data.map((section, index) => (
                <Section key={index} section={section} ref={(el) => (sectionRefs.current[index] = el)} />
                ))}
            </div>
      </div>
        </div>
    </div>
    )
}

export default LectureNotes;