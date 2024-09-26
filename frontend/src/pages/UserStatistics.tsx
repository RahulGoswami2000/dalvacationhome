import React from "react";

const UserStatistics: React.FC = () => {
  return (
    <div className="ml-4 p-4">
      <h3 className="text-lg font-bold mb-4">User Statistics</h3>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col items-center">
          <p className="text-center font-semibold">User count</p>
          <iframe
            width="500"
            height="500"
            src="https://lookerstudio.google.com/embed/reporting/9d913cfb-a44c-4b96-8b3f-1bcb60030fe8/page/DKf6D"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          ></iframe>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-center font-semibold">Number of rooms</p>
          <iframe
            width="650"
            height="660"
            src="https://lookerstudio.google.com/embed/reporting/0a9a3f43-83f5-4f03-afa5-204fbd37bd71/page/aSk6D"
            frameBorder="0"
            style={{border:0}}
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default UserStatistics;
