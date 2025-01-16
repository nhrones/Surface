# Rendering

Turning DOM into pixels, 60 times per second.

Chrome uses Skia for nearly all graphics operations, including text rendering.
Skia Graphics engine — makes calls to an underlying Graphics Library (like OpenGL, Vulkan, DirectX etc) which depends on the platform
