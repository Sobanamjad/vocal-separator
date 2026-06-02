import { NextResponse } from 'next/server';
import { writeFile, unlink, readFile } from 'fs/promises'; 
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  let tempFilePath = null;
  
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Save file temporarily
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    tempFilePath = join('/tmp', `${Date.now()}-${audioFile.name}`);
    await writeFile(tempFilePath, buffer);

    // Use demucs CLI to separate vocals
    const outputDir = join('/tmp', `demucs_output_${Date.now()}`);
    
    await execAsync(`npx demucs --two-stems vocals -o ${outputDir} ${tempFilePath}`);
    
    // Find generated files
    const songName = audioFile.name.replace(/\.[^/.]+$/, '');
    const vocalsPath = join(outputDir, 'htdemucs', songName, 'vocals.wav');
    const instrumentalPath = join(outputDir, 'htdemucs', songName, 'no_vocals.wav');
    
    // Convert to base64 or upload to blob storage
    const vocalsBuffer = await readFile(vocalsPath);
    const instrumentalBuffer = await readFile(instrumentalPath);
    
    const vocalsBase64 = `data:audio/wav;base64,${vocalsBuffer.toString('base64')}`;
    const instrumentalBase64 = `data:audio/wav;base64,${instrumentalBuffer.toString('base64')}`;

    // Cleanup temp files
    await unlink(tempFilePath);
    await execAsync(`rm -rf ${outputDir}`);

    return NextResponse.json({
      vocalsUrl: vocalsBase64,
      instrumentalUrl: instrumentalBase64
    });
    
  } catch (error) {
    console.error('Separation error:', error);
    return NextResponse.json({ error: 'Separation failed' }, { status: 500 });
  }
}