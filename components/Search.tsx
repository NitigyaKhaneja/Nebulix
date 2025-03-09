import React from "react";

export const SearchBar = () => (
    return(
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <input
            type="text"
            placeholder="Search movies..."
            className="w-3/4 p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-lg"
            onChange={handleSearch}
          />
        </motion.div>
    )
)