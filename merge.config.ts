// Builds one report from the blob reports of all shards:
//   npx playwright merge-reports --config merge.config.ts ./all-blob-reports
export default {
  testDir: './tests',
  reporter: [
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'reports/junit-merged.xml' }],
  ],
};
