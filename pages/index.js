import React, { useState, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import { useRouter } from 'next/router'

function getMenus() {
  const router = useRouter()
  console.log(router.query)
  if (router && router.query && router.query.menus) {
    console.log(router.query.menus)
    const menuList = router.query.menus.split(',');
    console.log(menuList)
    return menuList.map(menu => ({ name: decodeURIComponent(menu), count: 0 }));
  } else {
    return [
      { name: '아아', count: 0 },
      { name: '아라', count: 0 },
      { name: '따아', count: 0 },
      { name: '따라', count: 0 },
    ];
  }
}

function App() {
  const [ menuList, setMenuList ] = useState(getMenus());

  const increment = menuName => {
    setMenuList(menuList.map(m => {
      if (m.name === menuName) {
        m.count = m.count + 1;
      }
      return m;
    }));
  };

  const decrement = menuName => {
    setMenuList(menuList.map(m => {
      if (m.name === menuName) {
        m.count = m.count - 1;
      }
      return m;
    }).filter(m => {
      return m.count !== -1;
    }));
  };

  function getUrlParameter(menuList) {
    return '?menus=' + menuList.map(m => m.name).join(',');
  }

  function Link({ menuList, origin }) {
    const url = origin + useRouter().pathname + getUrlParameter(menuList);
    return (
      <a href={url}>{url}</a>
    );
  }

  function Menu({ menu }) {
    const m = menu.menu;
    const index = menu.index;

    const menuName = m.name;
    const inc = useCallback(
      () => {
        increment(menuName);
      },
      [menuName]
    );

    const dec = useCallback(
      () => {
        decrement(menuName);
      },
      [menuName]
    );

    return (
      <ListItem>
        <div key={ index } >
          <ButtonGroup color="primary" aria-label="outlined primary button group">
            <Button className="button is-success" onClick={ inc }><span className="title is-6">+</span></Button>
            <Button className="button"><span className="title is-6">{ `${m.name} (${m.count})` }</span></Button>&nbsp;
            <Button className="button is-danger" onClick={ dec }><span className="title is-6">-</span></Button>
          </ButtonGroup>
        </div>
      </ListItem>
    );
  }

  const [ newMenuName, setNewMenuName ] = useState('');
  const [ origin, setOrigin ] = useState('');

  setTimeout(function() {
    if(process.browser) {
      setOrigin(global.window.location.origin);
    }
  }.bind(this), 1000);

  function addMenu() {
    if (newMenuName) {
      menuList.push({ name: newMenuName, count: 0 });
      setMenuList(menuList);
      setNewMenuName('');
    }
  }

  return (
    <div className="App">
      <ListItem>
        <TextField value={newMenuName} onChange={e => setNewMenuName(e.target.value)} id="standard-basic" label="Menu Name" />
        <Button variant="contained" color="primary" onClick={ addMenu }>이거요</Button>
      </ListItem>
      {
        menuList && menuList.filter(m => {
          return newMenuName ? m.name.includes(newMenuName) : true;
        }).map((m, index) => {
          const menu = { menu: m, index };
          return <Menu key={index} menu={menu} />;
        })
      }
      <ListItem>
        <Link menuList={menuList} origin={origin} />
      </ListItem>
    </div>
  );
}

export default App;
