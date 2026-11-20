# ENT GROW

| 파일 | 용도 | 비고 |
|---|---|---|
| [`docs/사업계획서_ENT_GROW.md`](docs/사업계획서_ENT_GROW.md) | 전체 사업계획서 (13장 + 부록) | 내부 실행·투자 검토용 원본 |
| [`docs/IR_덱_ENT_GROW.pptx`](docs/IR_덱_ENT_GROW.pptx) | IR 덱 10장 (PowerPoint) | 발표·수정용 |
| [`docs/IR_덱_ENT_GROW.html`](docs/IR_덱_ENT_GROW.html) | IR 덱 10장 (웹) | 방향키로 넘김, 인쇄 시 PDF 변환 |
| [`docs/정부지원사업_요약본_ENT_GROW.md`](docs/정부지원사업_요약본_ENT_GROW.md) | 정부지원사업 제출용 요약 (10~15p) | 평가항목 대응표 포함 |
| [`docs/원페이지_사업개요서_ENT_GROW.html`](docs/원페이지_사업개요서_ENT_GROW.html) | A4 1장 사업개요서 | 인쇄/PDF 저장 버튼 포함 |
| `myidol/` | **MY IDOL 서비스 데모 웹사이트** | 연습생·팬·엔터 대시보드, `myidol/start.bat`으로 실행 |

## 사용 방법

- **IR 덱 (HTML)**: 브라우저로 열고 `←` `→` 또는 클릭으로 이동. `Ctrl+P` → PDF 저장 시 16:9 슬라이드로 출력됩니다.
- **원페이지 개요서**: 브라우저로 열고 우측 하단 `PDF로 저장 / 인쇄` → A4 1장으로 출력됩니다.
- **PPTX 수정**: PowerPoint에서 바로 편집 가능 (폰트: 맑은 고딕).
- **MY IDOL 데모**: `myidol/start.bat` 실행 후 `http://localhost:4800`. 데모 계정과 기능은 `myidol/README.md` 참고.

## 재생성 (PPTX)

`_build/ir.js`가 PPTX 생성 스크립트이며 결과물은 `docs/`에 저장됩니다.

```bash
npm install pptxgenjs
node _build/ir.js
```

## 채워야 할 항목

- 팀 구성 (대표·CTO·CDO 경력)
- 연락처 (이메일·전화)
- 시장 규모·재무 수치는 추정치 → 기획사 인터뷰로 검증 필요
