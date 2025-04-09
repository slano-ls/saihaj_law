type WritingEntry = {
    title: string;
    slug: string;
    date: string; // Using string for simplicity, can be Date object
};

type Writings = Array<WritingEntry>;

export const writingsData: Writings = [
    {
        title: "My First Sample Post",
        slug: "sample-post",
        date: "2024", // Keep year for consistency with experience section
    },
    // Add more entries here
]; 