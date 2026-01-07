'use client';

interface LearningPathData {
    name: string;
    slug: string;
    description: string;
    focus: string;
    features: string[];
    pricing: {
        plan: string;
        price: string;
        features: string[];
    }[];
    affiliateLink: string;
    website: string;
}

interface ComparisonTableProps {
    learningPaths: LearningPathData[];
}

export default function ComparisonTable({ learningPaths }: ComparisonTableProps) {
    return (
        <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Side-by-Side Comparison
            </h2>

            {/* Desktop: Horizontal scroll table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-4 px-4 font-semibold text-gray-900">
                                Feature
                            </th>
                            {learningPaths.map((path) => (
                                <th
                                    key={path.slug}
                                    className="text-center py-4 px-4 font-semibold text-gray-900"
                                >
                                    {path.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-100">
                            <td className="py-4 px-4 font-medium text-gray-700">Focus Area</td>
                            {learningPaths.map((path) => (
                                <td key={path.slug} className="py-4 px-4 text-center text-gray-600">
                                    {path.focus}
                                </td>
                            ))}
                        </tr>
                        <tr className="border-b border-gray-100">
                            <td className="py-4 px-4 font-medium text-gray-700">Starting Price</td>
                            {learningPaths.map((path) => (
                                <td key={path.slug} className="py-4 px-4 text-center text-gray-600">
                                    {path.pricing[0]?.price || 'N/A'}
                                </td>
                            ))}
                        </tr>
                        <tr className="border-b border-gray-100">
                            <td className="py-4 px-4 font-medium text-gray-700">Key Features</td>
                            {learningPaths.map((path) => (
                                <td key={path.slug} className="py-4 px-4 text-center text-gray-600">
                                    {path.features.length} features
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Mobile: Stacked card view */}
            <div className="md:hidden space-y-6">
                {learningPaths.map((path) => (
                    <div
                        key={path.slug}
                        className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50"
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{path.name}</h3>
                        <div className="space-y-3">
                            <div>
                                <span className="font-semibold text-gray-700">Focus Area: </span>
                                <span className="text-gray-600">{path.focus}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">Starting Price: </span>
                                <span className="text-gray-600">{path.pricing[0]?.price || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">Key Features: </span>
                                <span className="text-gray-600">{path.features.length} features</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

