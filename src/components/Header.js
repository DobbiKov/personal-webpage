import MainHeader from "./MainHeader";


const Header = ({active}) => (
    <div className='header_main_cont'>
        <div className='header_main_cont_inner'>
            <MainHeader remove={"contact"} active={active}/>
        </div>
    </div>
)
export default Header;