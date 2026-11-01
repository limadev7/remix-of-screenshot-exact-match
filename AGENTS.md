<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Transactional emails are React Email components under `src/email`, listed in the registry at `src/email/index.tsx`; features send them only through `sendTemplate()` in `src/lib/email.server.ts` (server-only), which renders the template and posts to the connected Resend account. Why: branding, subjects and props stay typed in one place, and no feature hand-writes email HTML.
