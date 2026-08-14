import { GiCheckeredFlag } from "react-icons/gi";
import { GrAnnounce } from "react-icons/gr";

export function Banner() {
  return (
    <div className="w-full bg-blue-600 dark:bg-blue-700 py-1 px-4 text-center mt-18">
      <p className="text-sm md:text-base font-medium text-white">
        <span className="inline-block mr-2">
          <GrAnnounce className="-mb-1"/>
        </span>
        Now available on 
        <img src="./src/assets/edge.svg" alt="Microsoft Edge" className="inline-block w-5 h-5 m-2" />
        <span className="font-semibold">Microsoft Edge! </span>
        <img src="./src/assets/chrome.svg" alt="Chrome" className="inline-block w-5 h-5 m-2" />
        Chrome support coming soon.
        <span className="inline-block ml-2 text-blue-200">
         <GiCheckeredFlag className=" text-gray-200 scale-x-[-1] -mb-0.5"/>
        </span>
      </p>
    </div>
  );
}