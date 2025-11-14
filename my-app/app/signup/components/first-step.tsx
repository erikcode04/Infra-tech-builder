"use client";

export default function Firststep({ setStep, userDetails, setUserDetails }: any) {
    return (
        <div className="w-full max-w-lg">
            <h2 className="text-4xl font-light mb-12 text-center font-mono">
                Choose a username
            </h2>

            {/* Input Form with Next Button */}
            <div className="flex gap-4 items-center">
                <input
                    type="text"
                    value={userDetails.username}
                    onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })}
                    placeholder="Username"
                    className="flex-1 p-4 bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors duration-200 font-mono"
                />
                <button onClick={() => setStep(2)} className="py-4 px-8 bg-white text-black font-medium font-mono tracking-wide hover:bg-gray-200 transition-all duration-200">
                    NEXT
                </button>
            </div>
        </div>
    )
}
