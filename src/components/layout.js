import React from "react"
import { Link } from "gatsby"

import { rhythm, scale } from "../utils/typography"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  let header

  if (location.pathname === rootPath) {
    header = (
      <h3
        style={{
          ...scale(1),
          marginBottom: rhythm(1.5),
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h3>
    )
  } else {
    header = (
      <h3
        style={{
          fontFamily: `Montserrat, sans-serif`,
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h3>
    )
  }
  return (
    <div style={{
      display: 'flex'
    }}>
      <div style={{flex:1}}></div>
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(24),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        flex: 3
      }}
    >
      <header>{header}</header>
      <main>{children}</main>
      <footer>
      <a target='blank' href='https://twitter.com/ThangLeQuoc'>Twitter</a> <a target="blank" href='https://www.linkedin.com/in/thang-le-a9695341'>LinkedIn</a>
      </footer>
    </div>
    <div style={{
      flex: 1,
    }}>
      <script data-ad-client="ca-pub-8475674499647022" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    </div>
    </div>
  )
}

export default Layout
