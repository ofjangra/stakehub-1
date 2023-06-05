import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
const Nav = () =>{
    const dispatch = useDispatch()
    return(
        <>
            <nav>
                <ul>
                    <li>
                        <Link to = "/" className="link">
                            Pending Orders
                        </Link>
                    </li>
                    <li>
                        <Link to = "/completed" className="link">
                            Completed Orders
                        </Link>
                    </li> 
                    <li>
                        <Link to = "/create" className="link">
                            Create Entry
                        </Link>
                    </li>
                    <li>
                        <Link to = "/chart" className="link">
                            Chart
                        </Link>
                    </li>
                    
                </ul>
            </nav>
        </>
    )
}

export default Nav