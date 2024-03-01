import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { useCookies } from "react-cookie";
import CreateThreadTab from "../components/CreateThreadTab";

function Thread() {
  const [token] = useCookies(["access_token", "refresh_token"]);
  const [showCreateThreadTab, setShowCreateThreadTab] = useState(false);

  const [fetchData, setStatus, status, responseData] = useFetch(
    {
      method: "GET",
      path: "/thread/all",
    },
    token.access_token
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="pt-8 px-7">
        <div className="flex flex-col mb-6">
          <h1 className="mb-5 text-3xl font-medium">today's feed</h1>

          <button
            onClick={() => setShowCreateThreadTab(!showCreateThreadTab)}
            className="px-4 py-2 font-bold text-white bg-orange-400 rounded-full mb-9 w-fit"
          >
            create thread
          </button>

          {showCreateThreadTab ? <CreateThreadTab /> : ""}
        </div>

        {status === "fetching"
          ? "loading threads.."
          : JSON.stringify(responseData)}

        <div className="flex flex-row space-x-4">
          <div className="flex flex-col w-full space-y-4 ">
            <div className="p-4 my-2.5 border-2 rounded-xl">
              <p>@qatarstudents</p>
              <h1 className="text-2xl">welcome to the thread-site</h1>
              <p>create, comment, react and tag your favorite threads!!!</p>
            </div>
          </div>
          <div className="flex flex-col w-full space-y-4">
            <div className="p-4  my-2.5 border-2 rounded-xl">
              <p>@qatarstudents</p>
              <h1 className="text-2xl">announcement: avatar is here</h1>
              <p>
                we added avatars into the site, you all have a custom profile
                picture now!!!
              </p>
            </div>
          </div>
          <div className="flex flex-col w-full space-y-4">
            <div className="p-4  my-2.5 border-2 rounded-xl">
              <p>@mun_students</p>
              <h1 className="text-2xl">who wanna join mun??</h1>
              <p>
                yall come to northwestern uni we have mun to start, fill in the
                form below if you want to joinnn
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Thread;
