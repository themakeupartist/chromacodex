insert into public.sources (id, name, source_type, source_url, reliability_role, notes)
values
  ('S001', 'Sensual Logic Artist Color Data', 'Measured Paint Dataset', 'https://sensuallogic.com/artistcolordata', 'Measured RGB data / source table', 'Source page states RGB values are measured with a spectrophotometer.'),
  ('S002', 'Winsor And Newton Professional Acrylic Colour Chart PDF', 'Official Manufacturer Colour Chart', 'https://www.winsornewton.com', 'Official manufacturer product-line source', 'Useful for official series, permanence, and line validation.')
on conflict (id) do nothing;

insert into public.brands (id, name, slug, manufacturer, synonyms, notes)
values
  ('B001', 'Winsor And Newton', 'winsor-and-newton', 'Colart', '{"Winsor & Newton","W&N"}', 'Canonical brand name uses And instead of ampersand.')
on conflict (id) do nothing;

insert into public.mediums (id, name, slug, parent_category, core_behavior_notes)
values
  ('M001', 'Oil', 'oil', 'Oil Based', 'Traditional oil paint.'),
  ('M002', 'Gouache', 'gouache', 'Water Based', 'Opaque water-based paint.'),
  ('M003', 'Acrylic', 'acrylic', 'Water Based', 'Acrylic polymer paint.')
on conflict (id) do nothing;

insert into public.product_lines (id, brand_id, medium_id, name, slug, formulation_family, product_line_type, finish, notes)
values
  ('PL001', 'B001', 'M001', 'Artists Oil', 'winsor-and-newton-artists-oil', 'Artists Oil', 'Artist Oil', null, 'Traditional Winsor And Newton artist oil line.'),
  ('PL002', 'B001', 'M002', 'Designers Gouache', 'winsor-and-newton-designers-gouache', 'Designers Gouache', 'Designer Gouache', 'Matte', 'Opaque water-based gouache line.'),
  ('PL003', 'B001', 'M003', 'Galeria Acrylic', 'winsor-and-newton-galeria-acrylic', 'Galeria Acrylic', 'Student Acrylic', null, 'Student acrylic line.'),
  ('PL004', 'B001', 'M003', 'Professional Acrylic', 'winsor-and-newton-professional-acrylic', 'Professional Acrylic', 'Artist Acrylic', null, 'Professional acrylic line.')
on conflict (id) do nothing;

insert into public.pigments (id, code, slug, color_family, status, notes)
values
  ('PIG000032', 'PR', 'pr', 'Red', 'Needs Review', 'Imported from source as incomplete code and should be validated.'),
  ('PIG000033', 'PR101', 'pr101', 'Orange', 'Valid', 'Synthetic iron oxide.'),
  ('PIG000046', 'PR83', 'pr83', 'Red', 'Valid', 'Traditional alizarin crimson pigment code.'),
  ('PIG000066', 'PY184', 'py184', 'Yellow', 'Valid', 'Bismuth vanadate yellow.'),
  ('PIG000068', 'PY35', 'py35', 'Yellow', 'Valid', 'Cadmium yellow pigment family.')
on conflict (id) do nothing;
