import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="min-w-[1000px]">
      <div className="flex bg-orange-400 text-white h-[60px]">
        <div className="items-center flow-root w-full mx-4 mt-4 mb-8">
          <div className="float-right pl-3 mt-3">
            <Link to={"/"}>
              <div className="text-sm font-bold xl:text-sm">
                qatarstudents.com
              </div>
            </Link>
          </div>

          <div className="flex items-center float-left mt-3">
            <Link to={"/explore"}>
              <div className="flex pl-3 pr-3">
                <div className="text-sm font-bold xl:text-sm">explore</div>
              </div>
            </Link>
            <Link to={"/thread"}>
              <div className="flex pl-3 pr-3">
                <div className="text-sm font-bold xl:text-sm">thread</div>
              </div>
            </Link>
            <Link to={"/chat"}>
              <div className="flex pl-3 pr-3">
                <div className="text-sm font-bold xl:text-sm">chat</div>
              </div>
            </Link>
            <Link to={"/events"}>
              <div className="flex pl-3 pr-3">
                <div className="text-sm font-bold xl:text-sm">events</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
