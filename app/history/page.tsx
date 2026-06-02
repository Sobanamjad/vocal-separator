// app/history/page.tsx
import { prisma } from '@/lib/prisma';

export default async function HistoryPage() {
    // Temporary: Hardcoded userId (baad mein Clerk se replace karenge)
    const separations = await prisma.separation.findMany({
        where: { userId: "temp-user-id" },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Your Separations</h1>
            {separations.length === 0 ? (
                <p>No songs separated yet.</p>
            ) : (
                <div className="space-y-4">
                    {separations.map((item) => (
                        <div key={item.id} className="border p-4 rounded-lg">
                            <p className="font-semibold">{item.originalName}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex gap-4 mt-2">
                                <a href={item.vocalsUrl} download className="text-blue-500">
                                    Download Vocals
                                </a>
                                <a href={item.instrumentalUrl} download className="text-green-500">
                                    Download Instrumental
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}