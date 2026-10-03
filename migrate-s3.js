import {
    S3Client,
    ListObjectsV2Command,
    GetObjectCommand,
    PutObjectCommand,
} from "@aws-sdk/client-s3";

async function streamToBuffer(stream) {
    const chunks = [];

    for await (const chunk of stream) {
        chunks.push(chunk);
    }

    return Buffer.concat(chunks);
}

async function migrate() {
    const minio = new S3Client({
        endpoint: "http://localhost:9000",
        region: "us-east-1",
        credentials: {
            accessKeyId: "minioadmin",
            secretAccessKey: "minioadmin",
        },
        forcePathStyle: true,
    });

    const supabase = new S3Client({
        endpoint:
            "https://ftlqtuuaiaxezxajpgiw.storage.supabase.co/storage/v1/s3",
        region: "ap-south-1",
        credentials: {
            accessKeyId: "08676cf7638b9b5a32e4d719ad528a55",
            secretAccessKey:
                "f08375051967dc7cd3cfb31d2397b4e05da374b3b99cba16a145975948056a77",
        },
        forcePathStyle: true,
    });

    const bucket = "student-portal-files";

    console.log("Fetching objects from MinIO...");

    const data = await minio.send(
        new ListObjectsV2Command({
            Bucket: bucket,
        })
    );

    const objects = data.Contents || [];

    console.log(`Found ${objects.length} objects.`);

    for (const obj of objects) {
        if (!obj.Key) continue;

        console.log(`Migrating ${obj.Key}...`);

        // 1. Download dari MinIO
        const getRes = await minio.send(
            new GetObjectCommand({
                Bucket: bucket,
                Key: obj.Key,
            })
        );

        const buffer = await streamToBuffer(getRes.Body);

        // 2. Upload ke Supabase Storage
        await supabase.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: obj.Key,
                Body: buffer,
                ContentType: getRes.ContentType,
            })
        );

        console.log(`Copied ${obj.Key} successfully.`);
    }

    console.log("Migration complete.");
}

migrate().catch(console.error);