Jekyll::Hooks.register :pages, :post_render do |page|
  page.output = page.output.gsub(
    "<head>",
    "<head><meta http-equiv=\"Permissions-Policy\" content=\"interest-cohort=()\">"
  )
end
