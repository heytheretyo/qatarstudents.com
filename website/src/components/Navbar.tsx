import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="min-w-[1000px]">
      <div className="flex bg-TK-background text-red-950 h-[60px]">
        <div className="flex items-center m-4">
          <Link to={"/"}>
            <div className="flex pl-3 pr-3">
              <div className="text-xs font-bold mt-7 xl:text-sm">home</div>
            </div>
          </Link>
          <Link to={"/blog"}>
            <div className="flex pl-3 pr-3">
              <div className="text-xs font-bold mt-7 xl:text-sm">blog</div>
            </div>
          </Link>
          <Link to={"/login"}>
            <div className="flex pl-3 pr-3">
              <div className="text-xs font-bold mt-7 xl:text-sm">login</div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
