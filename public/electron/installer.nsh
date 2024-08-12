!macro customInstall
   WriteRegStr HKCR "*\shell\cnde-demo" "" "cnde上传文件"
   WriteRegStr HKCR "*\shell\cnde-demo" "Icon" "$INSTDIR\cnde-demo.exe"
   WriteRegStr HKCR "*\shell\cnde-demo\command" "" '"$INSTDIR\cnde-demo.exe" "upload" "%1"'
!macroend
;卸载时清除
!macro customUninstall
   DeleteRegKey HKCR "*\shell\cnde-demo"
!macroend
