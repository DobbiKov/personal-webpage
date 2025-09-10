

import {Link} from 'react-router-dom';

const getActClassFor = (nav_but, active) => {
    if(nav_but == "main" && active == "main") return "main_cont_routs_active";
    if(nav_but == "about_me" && active == "about_me") return "main_cont_routs_active";
    if(nav_but == "lecture_notes" && active == "lecture_notes") return "main_cont_routs_active";
    if(nav_but == "contact_me" && active == "contact_me") return "main_cont_routs_active";
    return 0;
}

const MainHeader = ({remove, active}) => {
    let main_class = "";
    let contanct_class = "";
    if (remove == "main"){ main_class = "main_go_to_main" }
    if (remove == "contact"){ contanct_class = "main_go_to_main" }
    
return (
<div className="main_cont_routs">
<Link to="/" className={`main_header_a ${getActClassFor("main", active)}`} id={main_class}>DOBBIKOV</Link>
<Link to="/about_me" className={`main_header_a ${getActClassFor("about_me", active)}`}>ABOUT ME</Link>
<Link to="/lecture_notes" className={`main_header_a ${getActClassFor("lecture_notes", active)}`}>LECTURE NOTES</Link>
<Link to="/contact_me" className={`main_header_a ${getActClassFor("contact_me", active)}`} id = {contanct_class}>CONTACT ME</Link>
</div>
)
}

export default MainHeader;