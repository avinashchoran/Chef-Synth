import logo from "./assets/chef-claude-icon.png"
export default function Header(){
    return(
        <header>
            <img src={logo} />
            <h1>Chef Synth</h1>
        </header>
    )
}