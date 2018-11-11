select value
  from (
        select concat(Name, '(', substr(Occupation, 1, 1), ')') as value,
               1 as key1,
               Name as key2,
               NULL as key3
          from OCCUPATIONS

        union all

        select concat('There are a total of ', count(*), ' ', lower(Occupation), 's.') as value,
               2 as key1,
               count(*) as key2,
               Occupation as key3
          from OCCUPATIONS
        group by Occupation
       ) t
order by key1, key2, key3;
