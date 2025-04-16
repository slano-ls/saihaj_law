type WritingEntry = {
    title: string;
    slug: string;
    date: string; // Using string for simplicity, can be Date object
};

type Writings = Array<WritingEntry>;

export const writingsData: Writings = [
    {
        title: "The Ethics of Artificial Intelligence: A Modern Prometheus",
        slug: "ai-ethics-prometheus",
        date: "2024",
    },
    {
        title: "Digital Consciousness: Can Machines Truly Think?",
        slug: "digital-consciousness",
        date: "2024",
    },
    {
        title: "The Philosophy of Code: Beauty in Software Design",
        slug: "philosophy-of-code",
        date: "2024",
    },
    // Add more entries here
]; 