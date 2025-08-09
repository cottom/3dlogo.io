import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '3D File Formats Guide - STL, OBJ, FBX, glTF | 3DLogo.io',
  description: 'Complete guide to 3D file formats. Understand STL, OBJ, FBX, glTF and choose the right format for your project.',
  keywords: '3d file formats, stl format, obj format, fbx format, gltf format',
}

export default function FileFormatsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">3D File Formats Guide</h1>
      <p className="text-lg text-gray-600 mb-8">
        Everything you need to know about 3D file formats
      </p>
      {/* File format guide content will go here */}
    </main>
  )
}