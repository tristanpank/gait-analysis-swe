
function calculatePaceText(time) {
  if (!time) {
    return "";
  }

  const minutes = Math.floor(time);
  const seconds = Math.round((time - minutes) * 60);

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export default function BasicData(props) {
  const {videoData} = props;

  if (!videoData) {
    return null;
  }
  // videoData.cadence = 160;
  return (
    <div className="flex flex-col items-center px-4 w-[50%]">
      <h1 className="text-2xl font-bold">Basic Data</h1>
      {(videoData.cadence) && 
      <div>
        <p className="text-center w-full">Cadence: {Math.round(videoData.cadence)}</p>
        {(videoData.cadence < 170 || videoData.cadence > 190) ? <p className="font-bold text-red-600 text-center w-full">Warning: Cadence is not in the optimal range of 170-190 spm
        A cadence outside of this range can lead to injuries and ineffeciency in your form.</p> :
        <p className="font-bold text-green-600 text-center w-full">Your cadence is in the optimal range of 170-190 spm.</p>}
      </div>}
      {(videoData.pace) && 
      <div>
        <p>Pace: {calculatePaceText(videoData.pace)}</p>
      </div>}
      {(videoData.stride_length) &&
      <div>
        <p>Pace: {videoData.stride_length.toFixed(2)}</p>
      </div>
      }
    </div>
  )
}