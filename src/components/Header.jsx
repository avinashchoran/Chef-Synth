import logo from "../assets/chef-claude-icon.png"
import githubLogo from "../assets/github-icon.png"
export default function Header(){
    return(
        <header>
            <img src={logo} />
            <h1>Chef Synth</h1>
            
            <a className="github-link"
                href="https://github.com/avinashchoran/Chef-Synth"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img src={githubLogo} alt="GitHub Repo stars" />
            </a>

            
            
        </header>
    )
}