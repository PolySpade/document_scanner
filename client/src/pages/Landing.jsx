import { stacked_img } from "../assets";
import logo from "/logo.png";


const Landing = () => {
  return (
    <div className="flex justify-center items-center flex-col">
    <div className="flex justify-center">
      <img src={logo} className="h-20" />
    </div>
    <div className="my-4">Crop your documents at the click of a button!</div>
    <div className="flex justify-center">
      <div className="flex py-10 px-36 justify-center items-center flex-col bg-base-300 border-2 border-dashed border-base-content border-opacity-40 rounded-xl">
        <p>Drag your image file here</p>
        <img src={stacked_img} className=" w-64" />
        <div className="inline-flex items-center justify-center w-full my-4">
          <hr className="relative h-px bg-base-content border-0 w-52 opacity-50"></hr>
          <p className="absolute px-2 bg-base-300 text-white font-bold">OR</p>
        </div>
        <p className="font-bold text-base mb-4">Upload your image file here</p>
        <input type="file" className="file-input file-input-bordered file-input-secondary w-full max-w-xs" />
    </div>
  </div>
  </div>
  )
}

export default Landing