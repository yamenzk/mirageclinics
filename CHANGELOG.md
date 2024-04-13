## [1.0.3] - 2024-04-13
### Fixed
- Fixed a bug in printview.html (Replaced {{doc.name}} with {{name}} )

## [1.0.2] - 2024-04-13
### Added
- Attempting to run applyWatermark directly from printview.html


## [1.0.1] - 2024-04-13
### Added
- Added SweetAlert custom CSS styling.

### Changed
- Changed SWAL Styling.

### Deprecated
- Deprecated `drawDynamicTextOnCanvas()` in favor of `applyWatermark(docName)`.
- Deprecated the old modal in favor of `Sweet Alert`.

### Removed
- Removed drawDynamicTextOnCanvas().